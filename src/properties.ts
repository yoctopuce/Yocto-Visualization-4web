/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  all widgets customizable properties are described here
*  feel free to remove/modify/add more.
*
*
*  Prefix describe the widget
*  Name must match the widget properties
*  example:
*   GaugeFormProperties contains
*     SolidGauge_Uses360Mode which matches the  SolidGauge's Uses360Mode properties
*
*  Some properties might have an  index
*  example
*    for graphs
*    Graphs_series0  is the first series
*    ....
*    Graphs_series3  is the fourth series
*    if you need a fifth series, just create a Graphs_series4 properties
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

class GenericHints
{
    public static readonly DevConfAffected: string = " Changing this value will affect the device configuration.";
    public static readonly CheckSensor: string = "If the sensor you want to use is connected, but not listed or listed as OFFLINE, check USB / Network configuration in the global configuration.";
    public static readonly AnnotationGraph: string = "Annotation text.  Use \\n for carriage returns. Some variables are available: $DAY$ $MONTH$ $YEAR$ for date, $HOUR$ $MINUTE$ $SECOND$ for time, $AVGVALUE1$ $MINVALUE1$ $MAXVALUE1$ $NAME1$ $UNIT1$  for first series data, $AVGVALUE2$ $MINVALUE2$ $MAXVALUE2$ $NAME2$ $UNIT2$  for second series data and so on";
    public static readonly Annotation: string = "Annotation text.  Use \\n for carriage returns. Some variables are available: $DAY$ $MONTH$ $YEAR$ for date, $HOUR$ $MINUTE$ $SECOND$ for time, $AVGVALUE$ $MINVALUE$ $MAXVALUE$ $NAME$ $UNIT$ for sensor related data.";
}

export class TypeDescription
{
    public static get AllowedValues(): string[] { return []; }
}

export class sensorFreqTypeDescription
{
    private static readonly _AllowedValues: string[] = ["25/s", "10/s", "5/s", "4/s", "3/s", "2/s", "1/s",
        "60/m", "30/m", "12/m", "6/m", "4/m", "3/m", "2/m", "1/m",
        "30/h", "12/h", "6/h", "4/h", "3/h", "2/h", "1/h"];

    public static get AllowedValues(): string[] { return this._AllowedValues; }

}

export class yAxisDescription
{
    private static _AllowedValues: string[] = [];
    private static initialized: boolean;
    public static initialize(): void
    {
        let yaxiscount: number = 0;
        let obj: GraphFormProperties = new GraphFormProperties(null, null);
        let names: string[] = Object.getOwnPropertyNames(obj)
        names.forEach((name: string) =>
        {
            if (name.startsWith("_Graph_yAxes")) yaxiscount++;
        });

        for (let i: number = 0; i < yaxiscount; i++)
        {
            switch (i)
            {
            case 0:
                this._AllowedValues.push("1rst Y axis");
                break;
            case 1:
                this._AllowedValues.push("2nd Y axis");
                break;
            case 2:
                this._AllowedValues.push("3rd Y axis");
                break;
            default:
                this._AllowedValues.push((i + 1).toString() + "th Y axis");
                break;
            }
        }
        yAxisDescription.initialized = true;
    }

    public static get AllowedValues(): string[]
    {
        if (!yAxisDescription.initialized) yAxisDescription.initialize();
        return this._AllowedValues;
    }

}

export class AlarmTestTypeDescription
{
    private static _AllowedValues: string[] = ["Disabled", ">", ">=", "=", "<=", "<"];
    public static get AllowedValues(): string[] { return this._AllowedValues; }

}

export class fontNameTypeDescription
{
    private static readonly _AllowedValues: string[] = ["Arial",
        "Brush Script MT",
        "Comic Sans MS",
        "Courier New",
        "Garamond",
        "Georgia",
        "Helvetica",
        "Impact",
        "Tahoma",
        "Times New Roman",
        "Trebuchet MS",
        "Verdana"];

    static fontNameTypeDescription()
    {
        // in C# this is used to detect available fonts.
    }
    public static get AllowedValues(): string[] { return this._AllowedValues; }
}

export class sensorPrecisionTypeDescription
{
    private static readonly _AllowedValues: string[] = ["0", "0.1", "0.12", "0.123"];
    public static get AllowedValues(): string[] { return this._AllowedValues; }

}

export class sensorDataTypeDescription
{
    private static readonly _AllowedValues: string[] = ["Avg values", "Min values", "Max values"];
    public static get AllowedValues(): string[] { return this._AllowedValues; }
}

export class GaugeFormProperties extends YoctoVisualization.GenericProperties
{
    constructor(initData: YoctoVisualization.YXmlNode | null, owner: YoctoVisualization.YWidget)
    {
        super(owner)
        this.initFromXmlData(initData)
        this.PropagateDataSourceChange();
    }

    private PropagateDataSourceChange(): void
    {
        (this.ownerForm as YoctoVisualization.gaugeWidget).SourceChanged(this._DataSource_source, 0);
        let props: { [index: string]: YoctoVisualization.PropertyDescriptor } = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name: string;
        for (name in props)
        {
            if (name.startsWith("DataSource_AlarmSection"))
            {
                (<any>this)[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }
    }

    private _DataSource_source: YoctoVisualization.CustomYSensor = YoctoVisualization.sensorsManager.getNullSensor();
    public get ATTR_DataSource_source__DisplayName(): string {return "Sensor";}
    public get ATTR_DataSource_source__CategoryAttribute(): string {return "Data source";}
    public get ATTR_DataSource_source__ParamCategorySummaryAttribute(): string {return "sensorDescription";}
    public get ATTR_DataSource_source__PreExpandedCategoryAttribute(): boolean {return true;}
    public get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute(): boolean {return true;}
    public get ATTR_DataSource_source__DescriptionAttribute(): string {return "Yoctopuce sensor feeding the gauge. ";}
    public get DataSource_source(): YoctoVisualization.CustomYSensor { return this._DataSource_source}
    public set DataSource_source(value: YoctoVisualization.CustomYSensor)
    {
        let prev: YoctoVisualization.CustomYSensor = this._DataSource_source;
        this._DataSource_source = value;
        this.PropagateDataSourceChange();
        //#ifndef READONLY
        if (this._DataSource_source != prev) YoctoVisualization.constants.edited = true;
        //#endif
    }

    public get sensorDescription(): string
    {
        return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName();

    }

    public get isSensorReadOnly(): boolean {return this._DataSource_source.isReadOnly; }
    public get ATTR_DataSource_freq__DisplayName(): string {return "Sensor freq";}
    public get ATTR_DataSource_freq__CategoryAttribute(): string {return "Data source";}
    public get ATTR_DataSource_freq__NotSavedInXMLAttribute(): boolean {return true;}
    public get ATTR_DataSource_freq__IsReadonlyCallAttribute(): boolean {return this.isSensorReadOnly;}
    public get ATTR_DataSource_freq__AllowedValues(): string[] {return sensorFreqTypeDescription.AllowedValues;}
    public get ATTR_DataSource_freq__DescriptionAttribute(): string { return "Sensor data acquisition frequency." + GenericHints.DevConfAffected;}
    public get DataSource_freq(): string {return this._DataSource_source.get_frequency();}
    public set DataSource_freq(value: string) { this._DataSource_source.set_frequency(value);}

    private _DataSource_precision: string = "0.1";
    public get ATTR_DataSource_precision__DisplayName(): string {return "Precision";}
    public get ATTR_DataSource_precision__CategoryAttribute(): string {return "Data source";}
    public get ATTR_DataSource_precision__DescriptionAttribute(): string {return "How many digits shown after the decimal point";}
    public get ATTR_DataSource_precision__AllowedValues(): string[] { return sensorPrecisionTypeDescription.AllowedValues;}
    public get DataSource_precision(): string { return this._DataSource_precision; }
    public set DataSource_precision(value: string) { this._DataSource_precision = value; }

    private _DataSource_AlarmSection0: AlarmSection = new AlarmSection(0);
    public get ATTR_DataSource_AlarmSection0__DisplayName(): string {return "Sensor value alarm 1"}
    public get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_AlarmSection0__DescriptionAttribute(): string {return "Alarm 1 for this data source, expand for more."}
    public get DataSource_AlarmSection0(): AlarmSection { return this._DataSource_AlarmSection0; }
    public set DataSource_AlarmSection0(value: AlarmSection) {this._DataSource_AlarmSection0 = value; }

    private _DataSource_AlarmSection1: AlarmSection = new AlarmSection(1);
    public get ATTR_DataSource_AlarmSection1__DisplayName(): string {return "Sensor value alarm 2"}
    public get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_AlarmSection1__DescriptionAttribute(): string {return "Alarm 2 for this data source, expand for more."}
    public get DataSource_AlarmSection1(): AlarmSection { return this._DataSource_AlarmSection1; }
    public set DataSource_AlarmSection1(value: AlarmSection) {this._DataSource_AlarmSection1 = value; }

    private _SolidGauge_min: number = 0;
    public get ATTR_SolidGauge_min__DisplayName(): string {return "Minimum value"}
    public get ATTR_SolidGauge_min__CategoryAttribute(): string {return "Values range"}
    public get ATTR_SolidGauge_min__DescriptionAttribute(): string {return "Minimum value displayable by the gauge."}
    public get SolidGauge_min(): number { return this._SolidGauge_min; }
    public set SolidGauge_min(value: number) { this._SolidGauge_min = value; }

    private _SolidGauge_max: number = 100;
    public get ATTR_SolidGauge_max__DisplayName(): string {return "Maximum value"}
    public get ATTR_SolidGauge_max__CategoryAttribute(): string {return "Values range"}
    public get ATTR_SolidGauge_max__DescriptionAttribute(): string {return "Maximum value displayable by the gauge."}
    public get SolidGauge_max(): number { return this._SolidGauge_max; }
    public set SolidGauge_max(value: number) { this._SolidGauge_max = value; }

    private _SolidGauge_showMinMax: boolean = true;
    public get ATTR_SolidGauge_showMinMax__DisplayName(): string { return "show  min/max"}
    public get ATTR_SolidGauge_showMinMax__CategoryAttribute(): string { return "Values range"}
    public get ATTR_SolidGauge_showMinMax__DescriptionAttribute(): string { return "Show the min / max values."}
    public get SolidGauge_showMinMax(): boolean { return this._SolidGauge_showMinMax; }
    public set SolidGauge_showMinMax(value: boolean) { this._SolidGauge_showMinMax = value; }

    private _SolidGauge_color1: YDataRendering.YColor = YDataRendering.YColor.LightGreen;
    public get ATTR_SolidGauge_color1__DisplayName(): string {return "Min Color"}
    public get ATTR_SolidGauge_color1__CategoryAttribute(): string {return "Values range"}
    public get ATTR_SolidGauge_color1__DescriptionAttribute(): string {return "Color for minimum value."}
    public get SolidGauge_color1(): YDataRendering.YColor { return this._SolidGauge_color1; }
    public set SolidGauge_color1(value: YDataRendering.YColor) { this._SolidGauge_color1 = value; }

    private _SolidGauge_color2: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get ATTR_SolidGauge_color2__DisplayName(): string {return "Max Color"}
    public get ATTR_SolidGauge_color2__CategoryAttribute(): string {return "Values range"}
    public get ATTR_SolidGauge_color2__DescriptionAttribute(): string {return "Color for maximum value."}
    public get SolidGauge_color2(): YDataRendering.YColor { return this._SolidGauge_color2; }
    public set SolidGauge_color2(value: YDataRendering.YColor) { this._SolidGauge_color2 = value; }

    private _SolidGauge_font: FontDescription = new FontDescription("Arial", 20, YDataRendering.YColor.Black, false, true);
    public get ATTR_SolidGauge_font__DisplayName(): string { return "Unit  Font"}
    public get ATTR_SolidGauge_font__CategoryAttribute(): string { return "Fonts"}
    public get ATTR_SolidGauge_font__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_SolidGauge_font__DescriptionAttribute(): string { return "Font for displaying the value/status indicator"}
    public get SolidGauge_font(): FontDescription {return this._SolidGauge_font;}
    public set SolidGauge_font(value: FontDescription) {this._SolidGauge_font = value}

    private _SolidGauge_minMaxFont: FontDescription = new FontDescription("Arial", 10, YDataRendering.YColor.Black, false, true);
    public get ATTR_SolidGauge_minMaxFont__DisplayName(): string { return "Min Max  Font"}
    public get ATTR_SolidGauge_minMaxFont__CategoryAttribute(): string { return "Fonts"}
    public get ATTR_SolidGauge_minMaxFont__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_SolidGauge_minMaxFont__DescriptionAttribute(): string { return "Font for displaying min/max values"}
    public get SolidGauge_minMaxFont(): FontDescription { return this._SolidGauge_minMaxFont; }
    public set SolidGauge_minMaxFont(value: FontDescription) { this._SolidGauge_minMaxFont = value; }

    private _SolidGauge_displayMode: YDataRendering.YSolidGauge.DisplayModeEnumItem = YDataRendering.YSolidGauge.DisplayMode.DISPLAY90;
    public get ATTR_SolidGauge_displayMode__DisplayName(): string { return "Display mode"}
    public get ATTR_SolidGauge_displayMode__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_displayMode__DescriptionAttribute(): string { return "Dial general shape"}
    public get SolidGauge_displayMode(): YDataRendering.YSolidGauge.DisplayModeEnumItem { return this._SolidGauge_displayMode; }
    public set SolidGauge_displayMode(value: YDataRendering.YSolidGauge.DisplayModeEnumItem) { this._SolidGauge_displayMode = value; }

    private _SolidGauge_borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_SolidGauge_borderColor__DisplayName(): string { return "Border color"}
    public get ATTR_SolidGauge_borderColor__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_borderColor__DescriptionAttribute(): string { return "Dial border color." }
    public get SolidGauge_borderColor(): YDataRendering.YColor { return this._SolidGauge_borderColor; }
    public set SolidGauge_borderColor(value: YDataRendering.YColor) { this._SolidGauge_borderColor = value; }

    private _SolidGauge_borderThickness: number = 2;
    public get ATTR_SolidGauge_borderThickness__DisplayName(): string { return "Border thickness "}
    public get ATTR_SolidGauge_borderThickness__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_borderThickness__DescriptionAttribute(): string { return "Thickness of the dial border"}
    public get SolidGauge_borderThickness(): number { return this._SolidGauge_borderThickness; }
    public set SolidGauge_borderThickness(value: number) { this._SolidGauge_borderThickness = value; }

    private _SolidGauge_backgroundColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
    public get ATTR_SolidGauge_backgroundColor1__DisplayName(): string { return "Background color 1"}
    public get ATTR_SolidGauge_backgroundColor1__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_backgroundColor1__DescriptionAttribute(): string { return "Dial background gradient color 1." }
    public get SolidGauge_backgroundColor1(): YDataRendering.YColor { return this._SolidGauge_backgroundColor1; }
    public set SolidGauge_backgroundColor1(value: YDataRendering.YColor) { this._SolidGauge_backgroundColor1 = value; }

    private _SolidGauge_backgroundColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
    public get ATTR_SolidGauge_backgroundColor2__DisplayName(): string { return "Background color 2"}
    public get ATTR_SolidGauge_backgroundColor2__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_backgroundColor2__DescriptionAttribute(): string { return "Dial background gradient color 2." }
    public get SolidGauge_backgroundColor2(): YDataRendering.YColor { return this._SolidGauge_backgroundColor2; }
    public set SolidGauge_backgroundColor2(value: YDataRendering.YColor) { this._SolidGauge_backgroundColor2 = value; }

    private _SolidGauge_thickness: number = 25;
    public get ATTR_SolidGauge_thickness__DisplayName(): string { return "Dial thickness (%) "}
    public get ATTR_SolidGauge_thickness__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_thickness__DescriptionAttribute(): string { return "Thickness of the dial, in percentage relative to radius"}
    public get SolidGauge_thickness(): number { return this._SolidGauge_thickness; }
    public set SolidGauge_thickness(value: number) { this._SolidGauge_thickness = value; }

    private _SolidGauge_maxSpeed: number = 1;
    public get ATTR_SolidGauge_maxSpeed__DisplayName(): string { return "Max speed (%) "}
    public get ATTR_SolidGauge_maxSpeed__CategoryAttribute(): string { return "Dial"}
    public get ATTR_SolidGauge_maxSpeed__DescriptionAttribute(): string { return "Maximum speed of the dial in percentage relative to Max-Min. This is meant to limit \"teleporting\" effects."}
    public get SolidGauge_maxSpeed(): number { return this._SolidGauge_maxSpeed; }
    public set SolidGauge_maxSpeed(value: number) { this._SolidGauge_maxSpeed = value; }

    public IsDataSourceAssigned(): boolean
    {
        return !(this._DataSource_source instanceof YoctoVisualization.NullYSensor);
    }

    private _annotationPanels0: AnnotationPanelDescription = new AnnotationPanelDescription(
        YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$",
        YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127),
        10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
    public get ATTR_SolidGauge_annotationPanels0__DisplayName(): string { return "Annotation 1"}
    public get ATTR_SolidGauge_annotationPanels0__CategoryAttribute(): string { return "Annotations"}
    public get ATTR_SolidGauge_annotationPanels0__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_SolidGauge_annotationPanels0__DescriptionAttribute(): string { return "Customizable text panels"}
    public get SolidGauge_annotationPanels0(): AnnotationPanelDescription { return this._annotationPanels0; }
    public set SolidGauge_annotationPanels0(value: AnnotationPanelDescription) { this._annotationPanels0 = value; }

    private _annotationPanels1: AnnotationPanelDescription = new AnnotationPanelDescription(
        YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$",
        YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127),
        10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
    public get ATTR_SolidGauge_annotationPanels1__DisplayName(): string { return "Annotation 2"}
    public get ATTR_SolidGauge_annotationPanels1__CategoryAttribute(): string { return "Annotations"}
    public get ATTR_SolidGauge_annotationPanels1__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_SolidGauge_annotationPanels1__DescriptionAttribute(): string { return "Customizable text panels"}
    public get SolidGauge_annotationPanels1(): AnnotationPanelDescription { return this._annotationPanels1; }
    public set SolidGauge_annotationPanels1(value: AnnotationPanelDescription) { this._annotationPanels1 = value; }

}

//****************************
//  angular gauge
//****************************

export class AngularGaugeFormProperties extends YoctoVisualization.GenericProperties
{
    constructor(initData: YoctoVisualization.YXmlNode | null, owner: YoctoVisualization.YWidget)
    {
        super(owner)
        this.initFromXmlData(initData)
        this.PropagateDataSourceChange();
    }

    private PropagateDataSourceChange(): void
    {

        (this.ownerForm as YoctoVisualization.angularGaugeWidget).SourceChanged(this._DataSource_source, 0);
        let props: { [index: string]: YoctoVisualization.PropertyDescriptor } = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name: string;
        for (name in props)
        {
            if (name.startsWith("DataSource_AlarmSection"))
            {
                (<any>this)[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }

    }

    public IsDataSourceAssigned(): boolean
    {
        return !(this._DataSource_source instanceof YoctoVisualization.NullYSensor);
    }

    private _DataSource_source: YoctoVisualization.CustomYSensor = YoctoVisualization.sensorsManager.getNullSensor();
    public get ATTR_DataSource_source__DisplayName(): string {return "Sensor"}
    public get ATTR_DataSource_source__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_source__ParamCategorySummaryAttribute(): string {return "sensorDescription"}
    public get ATTR_DataSource_source__PreExpandedCategoryAttribute(): boolean {return true}
    public get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_DataSource_source__DescriptionAttribute(): string {return "Yoctopuce sensor feeding the gauge. " + GenericHints.CheckSensor}
    public get DataSource_source(): YoctoVisualization.CustomYSensor {return this._DataSource_source;}
    public set DataSource_source(value: YoctoVisualization.CustomYSensor)
    {
        let prev: YoctoVisualization.CustomYSensor = this._DataSource_source;
        this._DataSource_source = value;
        this.PropagateDataSourceChange();
        //#ifndef READONLY
        if (this._DataSource_source != prev) YoctoVisualization.constants.edited = true;
        //#endif
    }

    public get sensorDescription(): string
    {
        return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
    }

    public get isSensorReadOnly(): boolean { return this._DataSource_source.isReadOnly; }

    public get ATTR_DataSource_freq__DisplayName(): string { return "Sensor freq"}
    public get ATTR_DataSource_freq__CategoryAttribute(): string { return "Data source"}
    public get ATTR_DataSource_freq__NotSavedInXMLAttribute(): boolean { return true}
    public get ATTR_DataSource_freq__IsReadonlyCallAttribute(): string { return "isSensorReadOnly"}
    public get ATTR_DataSource_freq__DescriptionAttribute(): string { return "Sensor data acquisition frequency." + GenericHints.DevConfAffected}
    public get ATTR_DataSource_freq__AllowedValues(): string[] {return sensorFreqTypeDescription.AllowedValues;}
    public get DataSource_freq(): string { return this._DataSource_source.get_frequency(); }
    public set DataSource_freq(value: string) { this._DataSource_source.set_frequency(value); }

    private _DataSource_AlarmSection0: AlarmSection = new AlarmSection(0);
    public get ATTR_DataSource_AlarmSection0__DisplayName(): string {return "Sensor value alarm 1"}
    public get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_AlarmSection0__DescriptionAttribute(): string {return "Alarm 1 for this data source, expand for more."}
    public get DataSource_AlarmSection0(): AlarmSection { return this._DataSource_AlarmSection0; }
    public set DataSource_AlarmSection0(value: AlarmSection) {this._DataSource_AlarmSection0 = value; }

    private _DataSource_AlarmSection1: AlarmSection = new AlarmSection(1);
    public get ATTR_DataSource_AlarmSection1__DisplayName(): string {return "Sensor value alarm 2"}
    public get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_AlarmSection1__DescriptionAttribute(): string {return "Alarm 2 for this data source, expand for more."}
    public get DataSource_AlarmSection1(): AlarmSection { return this._DataSource_AlarmSection1; }
    public set DataSource_AlarmSection1(value: AlarmSection) {this._DataSource_AlarmSection1 = value; }

    private _AngularGauge_min: number = 0;
    public get ATTR_AngularGauge_min__DisplayName() {return "Minimum value"}
    public get ATTR_AngularGauge_min__CategoryAttribute() {return "Gauge gradations"}
    public get ATTR_AngularGauge_min__DescriptionAttribute() {return "Minimum value displayable by the gauge."}
    public get AngularGauge_min(): number {return this._AngularGauge_min;}
    public set AngularGauge_min(value: number) {this._AngularGauge_min = value;}

    private _AngularGauge_max: number = 100;
    public get ATTR_AngularGauge_max__DisplayName() {return "Maximum value"}
    public get ATTR_AngularGauge_max__CategoryAttribute() {return "Gauge gradations"}
    public get ATTR_AngularGauge_max__DescriptionAttribute() {return "Maximum value displayable by the gauge."}
    public get AngularGauge_max(): number {return this._AngularGauge_max;}
    public set AngularGauge_max(value: number) {this._AngularGauge_max = value;}

    private _AngularGauge_unitFactor: number = 1;
    public get ATTR_AngularGauge_unitFactor__DisplayName(): string {return "Unit factor"}
    public get ATTR_AngularGauge_unitFactor__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_unitFactor__DescriptionAttribute(): string {return "Data  will be divided by this value before being displayed, this allows simpler gradation marks."}
    public get AngularGauge_unitFactor(): number { return this._AngularGauge_unitFactor; }
    public set AngularGauge_unitFactor(value: number) { this._AngularGauge_unitFactor = value; }

    private _AngularGauge_graduation: number = 10;
    public get ATTR_AngularGauge_graduation__DisplayName(): string {return "Main gradation steps"}
    public get ATTR_AngularGauge_graduation__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_graduation__DescriptionAttribute(): string {return "Difference between two consecutive main gradation marks"}
    public get AngularGauge_graduation(): number {return this._AngularGauge_graduation;}
    public set AngularGauge_graduation(value: number) { this._AngularGauge_graduation = value}

    private _AngularGauge_graduationSize: number = 10;
    public get ATTR_AngularGauge_graduationSize__DisplayName(): string { return "Main gradation size (%)"}
    public get ATTR_AngularGauge_graduationSize__CategoryAttribute(): string { return "Gauge gradations"}
    public get ATTR_AngularGauge_graduationSize__DescriptionAttribute(): string { return "Main gradation marks size in percent, relative to dial radius"}
    public get AngularGauge_graduationSize(): number { return this._AngularGauge_graduationSize; }
    public set AngularGauge_graduationSize(value: number) { this._AngularGauge_graduationSize = value; }

    private _AngularGauge_graduationOuterRadiusSize: number = 98;
    public get ATTR_AngularGauge_graduationOuterRadiusSize__DisplayName(): string { return "Main gradation radius (%)"}
    public get ATTR_AngularGauge_graduationOuterRadiusSize__CategoryAttribute(): string { return "Gauge gradations"}
    public get ATTR_AngularGauge_graduationOuterRadiusSize__DescriptionAttribute(): string { return "Main gradation marks outer radius in percent, relative to dial radius"}
    public get AngularGauge_graduationOuterRadiusSize(): number { return this._AngularGauge_graduationOuterRadiusSize; }
    public set AngularGauge_graduationOuterRadiusSize(value: number) { this._AngularGauge_graduationOuterRadiusSize = value; }

    private _AngularGauge_graduationThickness: number = 2;
    public get ATTR_AngularGauge_graduationThickness__DisplayName(): string { return "Main gradation thickness"}
    public get ATTR_AngularGauge_graduationThickness__CategoryAttribute(): string { return "Gauge gradations"}
    public get ATTR_AngularGauge_graduationThickness__DescriptionAttribute(): string { return "Main gradation marks thickness"}
    public get AngularGauge_graduationThickness(): number { return this._AngularGauge_graduationThickness; }
    public set AngularGauge_graduationThickness(value: number) { this._AngularGauge_graduationThickness = value; }

    private _AngularGauge_graduationColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_AngularGauge_graduationColor__DisplayName(): string {return "Main gradation color"}
    public get ATTR_AngularGauge_graduationColor__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_graduationColor__DescriptionAttribute(): string {return "Main gradation marks color." }
    public get AngularGauge_graduationColor(): YDataRendering.YColor { return this._AngularGauge_graduationColor; }
    public set AngularGauge_graduationColor(value: YDataRendering.YColor) { this._AngularGauge_graduationColor = value; }

    private _AngularGauge_graduationFont: FontDescription = new FontDescription("Arial", 20, YDataRendering.YColor.Black, false, true);
    public get ATTR_AngularGauge_graduationFont__DisplayName(): string {return "Main gradation font"}
    public get ATTR_AngularGauge_graduationFont__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_graduationFont__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_AngularGauge_graduationFont__DescriptionAttribute(): string {return "Font used for gradation labels"}
    public get AngularGauge_graduationFont(): FontDescription { return this._AngularGauge_graduationFont; }
    public set AngularGauge_graduationFont(value: FontDescription) { this._AngularGauge_graduationFont = value; }

    private _AngularGauge_subgraduationCount: number = 5;
    public get ATTR_AngularGauge_subgraduationCount__DisplayName(): string {return "Sub-gradation count"}
    public get ATTR_AngularGauge_subgraduationCount__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_subgraduationCount__DescriptionAttribute(): string {return "How many sub-gradation (+1) marks between two consecutive main graduation marks"}
    public get AngularGauge_subgraduationCount(): number { return this._AngularGauge_subgraduationCount; }
    public set AngularGauge_subgraduationCount(value: number) { this._AngularGauge_subgraduationCount = value; }

    private _AngularGauge_subgraduationSize: number = 5;
    public get ATTR_AngularGauge_subgraduationSize__DisplayName(): string {return "Sub-gradation size (%)"}
    public get ATTR_AngularGauge_subgraduationSize__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_subgraduationSize__DescriptionAttribute(): string {return "Sub-gradation marks size in percent, relative to dial radius"}
    public get AngularGauge_subgraduationSize(): number { return this._AngularGauge_subgraduationSize }
    public set AngularGauge_subgraduationSize(value: number) { this._AngularGauge_subgraduationSize = value }

    private _AngularGauge_subgraduationThickness: number = 1;
    public get ATTR_AngularGauge_subgraduationThickness__DisplayName(): string {return "Sub-gradation thickness"}
    public get ATTR_AngularGauge_subgraduationThickness__CategoryAttribute(): string {return "Gauge gradations"}
    public get ATTR_AngularGauge_subgraduationThickness__DescriptionAttribute(): string {return "Sub-gradation marks thickness"}
    public get AngularGauge_subgraduationThickness(): number { return this._AngularGauge_subgraduationThickness; }
    public set AngularGauge_subgraduationThickness(value: number) { this._AngularGauge_subgraduationThickness = value; }

    private _AngularGauge_subgraduationColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_AngularGauge_subgraduationColor__DisplayName(): string { return "Sub-gradation color"}
    public get ATTR_AngularGauge_subgraduationColor__CategoryAttribute(): string { return "Gauge gradations"}
    public get ATTR_AngularGauge_subgraduationColor__DescriptionAttribute(): string { return "Sub-gradation marks color." }
    public get AngularGauge_subgraduationColor(): YDataRendering.YColor { return this._AngularGauge_subgraduationColor; }
    public set AngularGauge_subgraduationColor(value: YDataRendering.YColor) { this._AngularGauge_subgraduationColor = value; }

    private _AngularGauge_needleColor: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get ATTR_AngularGauge_needleColor__DisplayName(): string {return "Needle color"}
    public get ATTR_AngularGauge_needleColor__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleColor__DescriptionAttribute(): string {return "Needle filling color." }
    public get AngularGauge_needleColor(): YDataRendering.YColor { return this._AngularGauge_needleColor; }
    public set AngularGauge_needleColor(value: YDataRendering.YColor) { this._AngularGauge_needleColor = value; }

    private _AngularGauge_needleContourColor: YDataRendering.YColor = YDataRendering.YColor.DarkRed;
    public get ATTR_AngularGauge_needleContourColor__DisplayName(): string {return "Needle contour color"}
    public get ATTR_AngularGauge_needleContourColor__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleContourColor__DescriptionAttribute(): string {return "Needle contour color." }
    public get AngularGauge_needleContourColor(): YDataRendering.YColor { return this._AngularGauge_needleContourColor; }
    public set AngularGauge_needleContourColor(value: YDataRendering.YColor) { this._AngularGauge_needleContourColor = value; }

    private _AngularGauge_needleContourThickness: number = 1;
    public get ATTR_AngularGauge_needleContourThickness__DisplayName(): string {return "Needle contour thickness"}
    public get ATTR_AngularGauge_needleContourThickness__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleContourThickness__DescriptionAttribute(): string {return "Thickness of the needle contour"}
    public get AngularGauge_needleContourThickness(): number { return this._AngularGauge_needleContourThickness; }
    public set AngularGauge_needleContourThickness(value: number) { this._AngularGauge_needleContourThickness = value; }

    private _AngularGauge_needleLength1: number = 90;
    public get ATTR_AngularGauge_needleLength1__DisplayName(): string {return "Needle main size (%)"}
    public get ATTR_AngularGauge_needleLength1__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleLength1__DescriptionAttribute(): string {return "Length of the needle part pointing to gradations, in % relative to radius"}
    public get AngularGauge_needleLength1(): number { return this._AngularGauge_needleLength1; }
    public set AngularGauge_needleLength1(value: number) { this._AngularGauge_needleLength1 = value; }

    private _AngularGauge_needleLength2: number = 15;
    public get ATTR_AngularGauge_needleLength2__DisplayName(): string {return "Needle foot size (%)"}
    public get ATTR_AngularGauge_needleLength2__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleLength2__DescriptionAttribute(): string {return "Length of the needle part not pointing to gradations, in % relative to radius"}
    public get AngularGauge_needleLength2(): number { return this._AngularGauge_needleLength2; }
    public set AngularGauge_needleLength2(value: number) { this._AngularGauge_needleLength2 = value; }

    private _AngularGauge_needleWidth: number = 5;
    public get ATTR_AngularGauge_needleWidth__DisplayName(): string {return "Needle width (%)"}
    public get ATTR_AngularGauge_needleWidth__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleWidth__DescriptionAttribute(): string {return "Width of the needle, in % relative to radius"}
    public get AngularGauge_needleWidth(): number { return this._AngularGauge_needleWidth; }
    public set AngularGauge_needleWidth(value: number) { this._AngularGauge_needleWidth = value; }

    private _AngularGauge_needleMaxSpeed: number = 0.5;
    public get ATTR_AngularGauge_needleMaxSpeed__DisplayName(): string {return "Needle max speed (%)"}
    public get ATTR_AngularGauge_needleMaxSpeed__CategoryAttribute(): string {return "Needle"}
    public get ATTR_AngularGauge_needleMaxSpeed__DescriptionAttribute(): string {return "Needle Maximum speed, in % relative to (max-min). This is meant to limit \"teleporting\" effects."}
    public get AngularGauge_needleMaxSpeed(): number { return this._AngularGauge_needleMaxSpeed; }
    public set AngularGauge_needleMaxSpeed(value: number) { this._AngularGauge_needleMaxSpeed = value; }

    private _AngularGauge_unitFont: FontDescription = new FontDescription("Arial", 24, YDataRendering.YColor.DarkGray, false, true);
    public get ATTR_AngularGauge_unitFont__DisplayName(): string { return "Unit Line Font"}
    public get ATTR_AngularGauge_unitFont__CategoryAttribute(): string { return "Text lines"}
    public get ATTR_AngularGauge_unitFont__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_unitFont__DescriptionAttribute(): string { return "Font used in the text line describing unit"}
    public get AngularGauge_unitFont(): FontDescription { return this._AngularGauge_unitFont; }
    public set AngularGauge_unitFont(value: FontDescription) { this._AngularGauge_unitFont = value; }

    private _AngularGauge_statusFont: FontDescription = new FontDescription("Arial", 24, YDataRendering.YColor.DarkGray, false, true);
    public get ATTR_AngularGauge_statusFont__DisplayName(): string { return "Status Line Font"}
    public get ATTR_AngularGauge_statusFont__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_statusFont__CategoryAttribute(): string { return "Text lines"}
    public get ATTR_AngularGauge_statusFont__DescriptionAttribute(): string { return "Font used in the text line gauge status"}
    public get AngularGauge_statusFont(): FontDescription { return this._AngularGauge_statusFont; }
    public set AngularGauge_statusFont(value: FontDescription) { this._AngularGauge_statusFont = value; }

    private _AngularGauge_borderColor: YDataRendering.YColor = YDataRendering.YColor.Black
    public get ATTR_AngularGauge_borderColor__DisplayName(): string { return "Border color"}
    public get ATTR_AngularGauge_borderColor__CategoryAttribute(): string { return "Dial"}
    public get ATTR_AngularGauge_borderColor__DescriptionAttribute(): string { return "Dial border color." }
    public get AngularGauge_borderColor(): YDataRendering.YColor { return this._AngularGauge_borderColor; }
    public set AngularGauge_borderColor(value: YDataRendering.YColor) { this._AngularGauge_borderColor = value; }

    private _AngularGauge_borderThickness: number = 5;
    public get ATTR_AngularGauge_borderThickness__DisplayName(): string { return "Border thickness "}
    public get ATTR_AngularGauge_borderThickness__CategoryAttribute(): string { return "Dial"}
    public get ATTR_AngularGauge_borderThickness__DescriptionAttribute(): string { return "Thickness of the dial border"}
    public get AngularGauge_borderThickness(): number { return this._AngularGauge_borderThickness; }
    public set AngularGauge_borderThickness(value: number) { this._AngularGauge_borderThickness = value; }

    private _AngularGauge_backgroundColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
    public get ATTR_AngularGauge_backgroundColor1__DisplayName(): string { return "Background color 1"}
    public get ATTR_AngularGauge_backgroundColor1__CategoryAttribute(): string { return "Dial"}
    public get ATTR_AngularGauge_backgroundColor1__DescriptionAttribute(): string { return "Dial background gradient color 1." }
    public get AngularGauge_backgroundColor1(): YDataRendering.YColor { return this._AngularGauge_backgroundColor1; }
    public set AngularGauge_backgroundColor1(value: YDataRendering.YColor) { this._AngularGauge_backgroundColor1 = value; }

    private _AngularGauge_backgroundColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
    public get ATTR_AngularGauge_backgroundColor2__DisplayName(): string { return "Background color 2"}
    public get ATTR_AngularGauge_backgroundColor2__CategoryAttribute(): string { return "Dial"}
    public get ATTR_AngularGauge_backgroundColor2__DescriptionAttribute(): string { return "Dial background gradient color 2." }
    public get AngularGauge_backgroundColor2(): YDataRendering.YColor { return this._AngularGauge_backgroundColor2; }
    public set AngularGauge_backgroundColor2(value: YDataRendering.YColor) { this._AngularGauge_backgroundColor2 = value; }

    private _AngularGauge_zones0: AngularZoneDescription = new AngularZoneDescription(0, 50, YDataRendering.YColor.LightGreen);
    public get ATTR_AngularGauge_zones0__DisplayName(): string { return "Zone 1"}
    public get ATTR_AngularGauge_zones0__CategoryAttribute(): string { return "Zones"}
    public get ATTR_AngularGauge_zones0__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_zones0__DescriptionAttribute(): string { return "Zone 1 parameters"}
    public get AngularGauge_zones0(): AngularZoneDescription { return this._AngularGauge_zones0; }
    public set AngularGauge_zones0(value: AngularZoneDescription) { this._AngularGauge_zones0 = value; }

    private _AngularGauge_zones1: AngularZoneDescription = new AngularZoneDescription(50, 80, YDataRendering.YColor.Yellow);
    public get ATTR_AngularGauge_zones1__DisplayName(): string { return "Zone 2"}
    public get ATTR_AngularGauge_zones1__CategoryAttribute(): string { return "Zones"}
    public get ATTR_AngularGauge_zones1__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_zones1__DescriptionAttribute(): string { return "Zone 2 parameters"}
    public get AngularGauge_zones1(): AngularZoneDescription { return this._AngularGauge_zones1; }
    public set AngularGauge_zones1(value: AngularZoneDescription) { this._AngularGauge_zones1 = value; }

    private _AngularGauge_zones2: AngularZoneDescription = new AngularZoneDescription(80, 100, YDataRendering.YColor.Red);
    public get ATTR_AngularGauge_zones2__DisplayName(): string { return "Zone 2"}
    public get ATTR_AngularGauge_zones2__CategoryAttribute(): string { return "Zones"}
    public get ATTR_AngularGauge_zones2__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_zones2__DescriptionAttribute(): string { return "Zone 2 parameters"}
    public get AngularGauge_zones2(): AngularZoneDescription { return this._AngularGauge_zones2; }
    public set AngularGauge_zones2(value: AngularZoneDescription) { this._AngularGauge_zones2 = value; }

    private _annotationPanels0: AnnotationPanelDescription = new AnnotationPanelDescription(
        YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.CENTER, 0, false, "$NAME$",
        YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127),
        10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
    public get ATTR_AngularGauge_annotationPanels0__DisplayName(): string { return "Annotation 1"}
    public get ATTR_AngularGauge_annotationPanels0__CategoryAttribute(): string { return "Annotations"}
    public get ATTR_AngularGauge_annotationPanels0__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_annotationPanels0__DescriptionAttribute(): string { return "Customizable text panels"}
    public get AngularGauge_annotationPanels0(): AnnotationPanelDescription { return this._annotationPanels0; }
    public set AngularGauge_annotationPanels0(value: AnnotationPanelDescription) { this._annotationPanels0 = value; }

    private _annotationPanels1: AnnotationPanelDescription = new AnnotationPanelDescription(
        YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$",
        YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127),
        10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
    public get ATTR_AngularGauge_annotationPanels1__DisplayName(): string { return "Annotation 2"}
    public get ATTR_AngularGauge_annotationPanels1__CategoryAttribute(): string { return "Annotations"}
    public get ATTR_AngularGauge_annotationPanels1__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_AngularGauge_annotationPanels1__DescriptionAttribute(): string { return "Customizable text panels"}
    public get AngularGauge_annotationPanels1(): AnnotationPanelDescription { return this._annotationPanels1; }
    public set AngularGauge_annotationPanels1(value: AnnotationPanelDescription) { this._annotationPanels1 = value; }

}

export class ZoneDescription
{
    private _min: number;
    private _max: number
    private _visible: boolean = false;
    private _color: YDataRendering.YColor;

    constructor(min: number, max: number, color: YDataRendering.YColor)
    {
        this._min = min;
        this._max = max;
        this._color = color;
    }

    public get summary(): string
    { return this._visible ? this._min.toString() + ".." + this._max.toString() : "Disabled"; }

    public get ATTR_visible__DisplayName(): string {return "Visible"}
    public get ATTR_visible__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_visible__DescriptionAttribute(): string {return "Zone visibility." }
    public get visible(): boolean { return this._visible; }
    public set visible(value: boolean) { this._visible = value; }

    public get ATTR_min__DisplayName(): string {return "Minimum value";}
    public get ATTR_min__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_min__DescriptionAttribute(): string {return "Zone minimum value"}
    public get min(): number { return this._min; }
    public set min(value: number) { this._min = value; }

    public get ATTR_max__DisplayName(): string {return "Maximum value";}
    public get ATTR_max__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_max__DescriptionAttribute(): string {return "Zone maximum value"}
    public get max(): number { return this._max; }
    public set max(value: number) { this._max = value; }

    public get ATTR_color__DisplayName(): string {return "Color"}
    public get ATTR_color__DescriptionAttribute(): string {return "Zone color"}
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value: YDataRendering.YColor) { this._color = value; }

}

export class AngularZoneDescription
{
    private _width: number = 5;
    private _outerRadius: number = 98;
    private _min: number;
    private _max: number
    private _visible: boolean = false;
    private _color: YDataRendering.YColor;

    constructor(min: number, max: number, color: YDataRendering.YColor)
    {
        this._min = min;
        this._max = max;
        this._color = color;
    }

    public get summary(): string
    { return this._visible ? this._min.toString() + ".." + this._max.toString() : "Disabled"; }

    public get ATTR_visible__DisplayName(): string {return "Visible"}
    public get ATTR_visible__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_visible__DescriptionAttribute(): string {return "Zone visibility." }
    public get visible(): boolean { return this._visible; }
    public set visible(value: boolean) { this._visible = value; }

    public get ATTR_min__DisplayName(): string {return "Minimum value";}
    public get ATTR_min__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_min__DescriptionAttribute(): string {return "Zone minimum value"}
    public get min(): number { return this._min; }
    public set min(value: number) { this._min = value; }

    public get ATTR_max__DisplayName(): string {return "Maximum value";}
    public get ATTR_max__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_max__DescriptionAttribute(): string {return "Zone maximum value"}
    public get max(): number { return this._max; }
    public set max(value: number) { this._max = value; }

    public get ATTR_color__DisplayName(): string {return "Color"}
    public get ATTR_color__DescriptionAttribute(): string {return "Zone color"}
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value: YDataRendering.YColor) { this._color = value; }

    public get ATTR_outerRadius__DisplayName(): string {return "Outer radius (%)"}
    public get ATTR_outerRadius__DescriptionAttribute(): string {return "Zone outer radius, in percentage relative to dial radius "}
    public get outerRadius(): number { return this._outerRadius; }
    public set outerRadius(value: number) { this._outerRadius = value }

    public get ATTR_width__DisplayName(): string {return "Width (%)"}
    public get ATTR_width__DescriptionAttribute(): string {return "Zone  width, in percentage relative to dial radius "}
    public get width(): number { return this._width; }
    public set width(value: number) { this._width = value; }

}

//****************************
//  Fonts
//****************************

export class FontDescription
{
    constructor(name: string, size: number, color: YDataRendering.YColor, italic: boolean, bold: boolean)
    {
        this._name = name;
        this._size = size;
        this._color = color;
        this._italic = italic;
        this._bold = bold;
    }

    public ToString(): string { return this._name + " " + this._size.toString(); }

    public get summary(): string {return this._name + " " + this._size.toString();}

    private _name: string;
    public get ATTR_name__DisplayName(): string {return "Font name"}
    public get ATTR_name__AllowedValues(): string[] {return fontNameTypeDescription.AllowedValues;}
    public get ATTR_name__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_name__DescriptionAttribute(): string {return "Name of the font";}
    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    private _size: number;
    public get ATTR_size__DisplayName(): string {return "Font size"}
    public get ATTR_size__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_size__DescriptionAttribute(): string {return "Size of the font"}
    public get size(): number { return this._size; }
    public set size(value: number) { this._size = (Math.round(100 * value) / 100); }

    private _color: YDataRendering.YColor;
    public get ATTR_color__DisplayName(): string {return "Font color"}
    public get ATTR_color__DescriptionAttribute(): string {return "Color of the font." }
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value: YDataRendering.YColor) { this._color = value; }

    private _italic: boolean;
    public get ATTR_italic__DisplayName(): string {return "Italic"}
    public get ATTR_italic__DescriptionAttribute(): string {return "Is the font style italic?."}
    public get italic(): boolean { return this._italic; }
    public set italic(value: boolean) { this._italic = value; }

    private _bold: boolean;
    public get ATTR_bold__DisplayName(): string {return "Bold"}
    public get ATTR_bold__DescriptionAttribute(): string {return "Is the font style bold?."}
    public get bold(): boolean { return this._bold; }
    public set bold(value: boolean) { this._bold = value; }

}

//****************************
//  Digital display
//****************************

export class digitalDisplayFormProperties extends YoctoVisualization.GenericProperties
{
    constructor(initData: YoctoVisualization.YXmlNode | null, owner: YoctoVisualization.YWidget)
    {
        super(owner)
        this.initFromXmlData(initData)
        this.PropagateDataSourceChange();
    }

    private PropagateDataSourceChange(): void
    {

        (this.ownerForm as YoctoVisualization.digitalDisplayWidget).SourceChanged(this._DataSource_source, 0);
        let props: { [index: string]: YoctoVisualization.PropertyDescriptor } = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name: string;
        for (name in props)
        {
            if (name.startsWith("DataSource_AlarmSection"))
            {
                (<any>this)[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }

    }

    public IsDataSourceAssigned(): boolean
    {
        return !(this._DataSource_source instanceof YoctoVisualization.NullYSensor);
    }

    private _DataSource_source: YoctoVisualization.CustomYSensor = YoctoVisualization.sensorsManager.getNullSensor();
    public get ATTR_DataSource_source__DisplayName(): string {return "Sensor"}
    public get ATTR_DataSource_source__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_source__ParamCategorySummaryAttribute(): string {return "sensorDescription"}
    public get ATTR_DataSource_source__PreExpandedCategoryAttribute(): boolean {return true}
    public get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_DataSource_source__DescriptionAttribute(): string {return "Yoctopuce sensor feeding the display. " + GenericHints.CheckSensor}
    public get DataSource_source(): YoctoVisualization.CustomYSensor { return this._DataSource_source; }
    public set DataSource_source(value: YoctoVisualization.CustomYSensor)
    {
        let prev: YoctoVisualization.CustomYSensor = this._DataSource_source;
        this._DataSource_source = value;
        this.PropagateDataSourceChange();
        //#ifndef READONLY
        if (this._DataSource_source != prev) YoctoVisualization.constants.edited = true;
        //#endif
    }

    public get isSensorReadOnly(): boolean { return this._DataSource_source.isReadOnly; }

    public get sensorDescription(): string
    {
        return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
    }

    public get ATTR_DataSource_freq__DisplayName(): string {return "Sensor freq"}
    public get ATTR_DataSource_freq__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_freq__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_freq__IsReadonlyCallAttribute(): string {return "isSensorReadOnly"}
    public get ATTR_DataSource_freq__DescriptionAttribute(): string {return "Sensor data acquisition frequency." + GenericHints.DevConfAffected}
    public get ATTR_DataSource_freq__AllowedValues(): string[] {return sensorFreqTypeDescription.AllowedValues;}
    public get DataSource_freq(): string { return this._DataSource_source.get_frequency(); }
    public set DataSource_freq(value: string) { this._DataSource_source.set_frequency(value);}

    private _DataSource_precision: string = "0.1";
    public get ATTR_DataSource_precision__DisplayName(): string {return "Precision"}
    public get ATTR_DataSource_precision__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_precision__DescriptionAttribute(): string {return "How many digits shown after the decimal point."}
    public get ATTR_DataSource_precision__AllowedValues(): string[] {return sensorPrecisionTypeDescription.AllowedValues;}
    public get DataSource_precision(): string { return this._DataSource_precision; }
    public set DataSource_precision(value: string) { this._DataSource_precision = value }

    private _DataSource_AlarmSection0: AlarmSection = new AlarmSection(0);
    public get ATTR_DataSource_AlarmSection0__DisplayName(): string {return "Sensor value alarm 1"}
    public get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_AlarmSection0__DescriptionAttribute(): string {return "Alarm 1 for this data source, expand for more."}
    public get DataSource_AlarmSection0(): AlarmSection { return this._DataSource_AlarmSection0; }
    public set DataSource_AlarmSection0(value: AlarmSection) {this._DataSource_AlarmSection0 = value; }

    private _DataSource_AlarmSection1: AlarmSection = new AlarmSection(1);
    public get ATTR_DataSource_AlarmSection1__DisplayName(): string {return "Sensor value alarm 2"}
    public get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__CategoryAttribute(): string {return "Data source"}
    public get ATTR_DataSource_AlarmSection1__DescriptionAttribute(): string {return "Alarm 2 for this data source, expand for more."}
    public get DataSource_AlarmSection1(): AlarmSection { return this._DataSource_AlarmSection1; }
    public set DataSource_AlarmSection1(value: AlarmSection) {this._DataSource_AlarmSection1 = value; }

    private _font: FontDescription = new FontDescription("Arial", 48, YDataRendering.YColor.LightGreen, false, true);
    public get ATTR_display_font__DisplayName(): string {return "Font"}
    public get ATTR_display_font__CategoryAttribute(): string {return "Display"}
    public get ATTR_display_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_display_font__DescriptionAttribute(): string {return "Display font"}
    public get display_font(): FontDescription { return this._font; }
    public set display_font(value: FontDescription) { this._font = value; }

    private _display_backgroundColor1: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_display_backgroundColor1__DisplayName(): string { return "Background color 1"}
    public get ATTR_display_backgroundColor1__CategoryAttribute(): string { return "Display"}
    public get ATTR_display_backgroundColor1__DescriptionAttribute(): string { return "Display background gradient color 1." }
    public get display_backgroundColor1(): YDataRendering.YColor { return this._display_backgroundColor1; }
    public set display_backgroundColor1(value: YDataRendering.YColor) { this._display_backgroundColor1 = value; }

    private _display_backgroundColor2: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_display_backgroundColor2__DisplayName(): string { return "Background color 2"}
    public get ATTR_display_backgroundColor2__CategoryAttribute(): string { return "Display"}
    public get ATTR_display_backgroundColor2__DescriptionAttribute(): string { return "Display background gradient color 2." }
    public get display_backgroundColor2(): YDataRendering.YColor { return this._display_backgroundColor2; }
    public set display_backgroundColor2(value: YDataRendering.YColor) { this._display_backgroundColor2 = value; }

    private _hrzAlignment: YDataRendering.YDigitalDisplay.HrzAlignmentEnumItem = YDataRendering.YDigitalDisplay.HrzAlignment.RIGHT;
    public get ATTR_display_hrzAlignment__DisplayName(): string {return "Hrz alignment method"}
    public get ATTR_display_hrzAlignment__CategoryAttribute(): string {return "Display"}
    public get ATTR_display_hrzAlignment__DescriptionAttribute(): string {return "Horizontal alignment method"}
    public get display_hrzAlignment(): YDataRendering.YDigitalDisplay.HrzAlignmentEnumItem { return this._hrzAlignment; }
    public set display_hrzAlignment(value: YDataRendering.YDigitalDisplay.HrzAlignmentEnumItem) { this._hrzAlignment = value; }

    private _hrzAlignmentOfset: number = 5.0;
    public get ATTR_display_hrzAlignmentOfset__DisplayName() {return "Hrz alignment offset"}
    public get ATTR_display_hrzAlignmentOfset__CategoryAttribute() {return "Display"}
    public get ATTR_display_hrzAlignmentOfset__DescriptionAttribute() {return "Horizontal alignment offset in percentage. No effect when chosen horizontal alignment is CENTER"}
    public get display_hrzAlignmentOfset(): number { return this._hrzAlignmentOfset; }
    public set display_hrzAlignmentOfset(value: number) { this._hrzAlignmentOfset = value; }

    private _outOfRangeMin: YoctoVisualization.doubleNan = new YoctoVisualization.doubleNan(Number.NaN);
    public get ATTR_display_outOfRangeMin__DisplayName(): string {return "Minimum value"}
    public get ATTR_display_outOfRangeMin__CategoryAttribute(): string {return "Range Control"}
    public get ATTR_display_outOfRangeMin__DescriptionAttribute(): string {return "Regular range minimum value. if value goes  outside regular  range, color will turn to \"Out of range Color\".Leave blank if you don't want to define such a range. "}
    public get display_outOfRangeMin(): YoctoVisualization.doubleNan {return this._outOfRangeMin; }
    public set display_outOfRangeMin(value: YoctoVisualization.doubleNan) { this._outOfRangeMin = value; }

    private _outOfRangeMax: YoctoVisualization.doubleNan = new YoctoVisualization.doubleNan(Number.NaN);
    public get ATTR_display_outOfRangeMax__DisplayName(): string {return "Maximum value"}
    public get ATTR_display_outOfRangeMax__CategoryAttribute(): string {return "Range Control"}
    public get ATTR_display_outOfRangeMax__DescriptionAttribute(): string {return "Regular range minimum value. if value goes  outside regular  range, color will turn to \"Out of range Color\".Leave blank if you don't want to define such a range. "}
    public get display_outOfRangeMax(): YoctoVisualization.doubleNan {return this._outOfRangeMax; }
    public set display_outOfRangeMax(value: YoctoVisualization.doubleNan) { this._outOfRangeMax = value; }

    private _outOfRangeColor: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get ATTR_display_outOfRangeColor__DisplayName(): string {return "Out of range Color"}
    public get ATTR_display_outOfRangeColor__CategoryAttribute(): string {return "Range Control"}
    public get ATTR_display_outOfRangeColor__DescriptionAttribute(): string {return "Digits color when value is out of range." }
    public get display_outOfRangeColor(): YDataRendering.YColor {return this._outOfRangeColor}
    public set display_outOfRangeColor(value: YDataRendering.YColor) { this._outOfRangeColor = value}

    private _annotationPanels0: AnnotationPanelDescription = new AnnotationPanelDescription(
        YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.CENTER, 0, false, "$NAME$",
        YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127),
        10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
    public get ATTR_display_annotationPanels0__DisplayName(): string { return "Annotation 1"}
    public get ATTR_display_annotationPanels0__CategoryAttribute(): string { return "Annotations"}
    public get ATTR_display_annotationPanels0__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_display_annotationPanels0__DescriptionAttribute(): string { return "Customizable text panels"}
    public get display_annotationPanels0(): AnnotationPanelDescription { return this._annotationPanels0; }
    public set display_annotationPanels0(value: AnnotationPanelDescription) { this._annotationPanels0 = value; }

    private _annotationPanels1: AnnotationPanelDescription = new AnnotationPanelDescription(
        YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$",
        YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127),
        10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
    public get ATTR_display_annotationPanels1__DisplayName(): string { return "Annotation 2"}
    public get ATTR_display_annotationPanels1__CategoryAttribute(): string { return "Annotations"}
    public get ATTR_display_annotationPanels1__ReadOnlyAttribute(): boolean { return true}
    public get ATTR_display_annotationPanels1__DescriptionAttribute(): string { return "Customizable text panels"}
    public get display_annotationPanels1(): AnnotationPanelDescription { return this._annotationPanels1; }
    public set display_annotationPanels1(value: AnnotationPanelDescription) { this._annotationPanels1 = value; }
}

/****************************************
 * Alarm section
 */

export class AlarmSection
{

    private _sensor: YoctoVisualization.CustomYSensor = YoctoVisualization.sensorsManager.getNullSensor();
    private _index: number = 0;
    public get summary(): string
    {
        let c: number = this._sensor.getAlarmCondition(this._index);
        if (c == 0) return "Disabled";
        return "Enabled";
    }

    constructor(index: number)
    { this._index = index; }

    public get ATTR_source__DisplayName(): string { return "Data source type"}
    public get ATTR_source__NotSavedInXMLAttribute(): boolean { return true}
    public get ATTR_source__AllowedValues(): string[] { return sensorDataTypeDescription.AllowedValues;}
    public get ATTR_source__DescriptionAttribute(): string { return "Alarm sensor data source (Average, minimum or maximum value during last interval)"}
    public get source(): number { return this._sensor.getAlarmSource(this._index);}
    public set source(value: number) { this._sensor.setAlarmSource(this._index, value);}

    public get ATTR_condition__DisplayName(): string { return "Test Condition"}
    public get ATTR_condition__NotSavedInXMLAttribute(): boolean { return true}
    public get ATTR_condition__AllowedValues(): string[] { return AlarmTestTypeDescription.AllowedValues;}
    public get ATTR_condition__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_condition__DescriptionAttribute(): string { return "Alarm trigger condition"}
    public get condition(): number {return this._sensor.getAlarmCondition(this._index); }
    public set condition(value: number) {this._sensor.setAlarmCondition(this._index, value); }

    public setDataSource(sensor: YoctoVisualization.CustomYSensor): void
    {this._sensor = sensor; }

    public get ATTR_value__DisplayName(): string { return "Test Value"}
    public get ATTR_value__NotSavedInXMLAttribute(): boolean { return true}
    public get ATTR_value__DescriptionAttribute(): string { return "Value for the Alarm trigger"}
    public get value(): number { return this._sensor.getAlarmValue(this._index);}
    public set value(value: number) { this._sensor.setAlarmValue(this._index, value); }

    public get ATTR_commandLine__DisplayName(): string {return "Trigger action"}
    public get ATTR_commandLine__NotSavedInXMLAttribute(): boolean {return true;}
    public get ATTR_commandLine__DescriptionAttribute(): string {return "Javascript snippet executed in your browser each time the alarm is triggered, you can use the following variables: $SENSORVALUE$, $UNIT$, $HWDID$, $NAME$, $CONDITION$, $TRIGGER$, $DATATYPE$, $NOW$. Example : <tt>alarm('Warning $NAME$ = $SENSORVALUE$!');</tt>. You can check logs to find out if your alarm code works."}
    public get commandLine(): string {return this._sensor.getAlarmCommandline(this._index);}
    public set commandLine(value: string) { this._sensor.setAlarmCommandline(this._index, value);}

    public get ATTR_delay__DisplayName(): string {return "Trigger delay";}
    public get ATTR_delay__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_delay__DescriptionAttribute(): string {return "Minimum delay, in seconds, between two alarms. Think carefully and make sure you won't create alarm storms."}
    public get delay(): number { return this._sensor.getAlarmDelay(this._index)};
    public set delay(value: number) {this._sensor.setAlarmDelay(this._index, value);};

}

/*********************************
 * SERIES
 */

export class ChartSerie
{

    private ownerForm: YoctoVisualization.YWidget | null = null;
    private index: number = -1;
    public  dataloggerAlreadyLoaded = false;

    constructor(defaultColor: YDataRendering.YColor)
    { this._color = defaultColor; }

    public get summary(): string
    { return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName() + (this._DataSource_source.isOnline() ? "" : " - OFFLINE"); }

    public Init(owner: YoctoVisualization.YWidget, serieIndex: number): void
    {
        this.ownerForm = owner;
        this.index = serieIndex;
        this.PropagateDataSourceChange(this._DataSource_source);
    }


    private PropagateDataSourceChange(value: YoctoVisualization.CustomYSensor): void
    {

        (this.ownerForm as YoctoVisualization.graphWidget).SourceChanged(this._DataSource_source, this.index);
        let props: { [index: string]: YoctoVisualization.PropertyDescriptor } = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name: string;
        for (name in props)
        {
            if (name.startsWith("DataSource_AlarmSection"))
            {
                (<any>this)[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }

    }

    private _DataSource_source: YoctoVisualization.CustomYSensor = YoctoVisualization.sensorsManager.getNullSensor();
    public get ATTR_DataSource_source__DisplayName(): string {return "Sensor"}
    public get ATTR_DataSource_source__CopyToTarget(): boolean {return false}  // this extra property doesn't exist is graph's series
    public get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_DataSource_source__DescriptionAttribute(): string {return "Yoctopuce sensor feeding the graph. " + GenericHints.CheckSensor}
    public get DataSource_source(): YoctoVisualization.CustomYSensor { return this._DataSource_source; }
    public set DataSource_source(value: YoctoVisualization.CustomYSensor)
    {
        let prev: YoctoVisualization.CustomYSensor = this._DataSource_source;
        this._DataSource_source = value;
        //#ifndef READONLY
        if (this._DataSource_source != prev) YoctoVisualization.constants.edited = true;
        //#endif
        if (this.ownerForm != null) this.PropagateDataSourceChange(this._DataSource_source);
    }

    public get isSensorReadOnly(): boolean { return this._DataSource_source.isReadOnly; }

    public get ATTR_DataSource_freq__DisplayName(): string {return "Sensor frequency"}
    public get ATTR_DataSource_freq__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_freq__CopyToTarget(): boolean {return false}  // this extra property doesn't exist is graph's series
    public get ATTR_DataSource_freq__IsReadonlyCallAttribute(): string {return "isSensorReadOnly"}
    public get ATTR_DataSource_freq__DescriptionAttribute(): string {return "Sensor data acquisition frequency." + GenericHints.DevConfAffected}
    public get ATTR_DataSource_freq__AllowedValues(): string[] {return sensorFreqTypeDescription.AllowedValues;}
    public get DataSource_freq(): string {return this._DataSource_source.get_frequency();}
    public set DataSource_freq(value: string) { this._DataSource_source.set_frequency(value);}

    private _DataType: number = 0;
    public get ATTR_DataSource_datatype__DisplayName(): string {return "Sensor data"}
    public get ATTR_DataSource_datatype__AllowedValues(): string[] {return sensorDataTypeDescription.AllowedValues;}
    public get ATTR_DataSource_datatype__CopyToTarget(): boolean {return false}  // this extra property doesn't exist is graph's series
    public get ATTR_DataSource_datatype__DescriptionAttribute(): string {return "Which data for sensor are displayed on the graph. Min and Max are available only for frequencies <1Hz"}
    public get DataSource_datatype(): number {return this._DataType;}
    public set DataSource_datatype(value: number)
    {
        this._DataType = value;
        if (this.ownerForm != null)
        {
            (this.ownerForm as YoctoVisualization.graphWidget).SourceChanged(this._DataSource_source, this.index);
        }
    }

    public get ATTR_DataSource_recording__DisplayName(): string {return "Sensor recording"}
    public get ATTR_DataSource_recording__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_recording__IsReadonlyCallAttribute(): string {return "isSensorReadOnly"}
    public get ATTR_DataSource_recording__CopyToTarget(): boolean {return false}  // this extra property doesn't exist is graph's series

    public get ATTR_DataSource_recording__DescriptionAttribute(): string {return "Enable/ disable sensor data recording in the device on-board datalogger." + GenericHints.DevConfAffected }
    public get DataSource_recording(): boolean { return this._DataSource_source.get_recording(); }
    public set DataSource_recording(value: boolean) { this._DataSource_source.set_recording(value); }

    private _thickness: number = 2.0;
    public get ATTR_thickness__DisplayName(): string {return "Thickness"}
    public get ATTR_thickness__DescriptionAttribute(): string {return "Line thickness."}
    public get thickness(): number {return this._thickness;}
    public set thickness(value: number) { this._thickness = value;}

    private _legend: string = "";
    public get ATTR_legend__DisplayName(): string { return "Legend"}
    public get ATTR_legend__DescriptionAttribute(): string { return "Short description of the series.";}
    public get legend(): string { return this._legend; }
    public set legend(value: string) { this._legend = value; }

    private _color: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get ATTR_color__DisplayName(): string {return "Color"}
    public get ATTR_color__DescriptionAttribute(): string {return "Line color."}
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value: YDataRendering.YColor) { this._color = value; }

    private _yAxisIndex: number = 0;
    public get ATTR_yAxisIndex__AllowedValues(): string[] {return yAxisDescription.AllowedValues;}
    public get ATTR_yAxisIndex__DisplayName(): string {return "Y axis"}
    public get ATTR_yAxisIndex__DescriptionAttribute(): string {return "Choose which Y axis the data with be scaled to."}
    public get yAxisIndex(): number { return this._yAxisIndex; }
    public set yAxisIndex(value: number) { this._yAxisIndex = value; }

    private _DataSource_AlarmSection0: AlarmSection = new AlarmSection(0);
    public get ATTR_DataSource_AlarmSection0__DisplayName(): string {return "Sensor value alarm 1"}
    public get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection0__DescriptionAttribute(): string {return "Alarm 1 for this data source, expand for more."}
    public get DataSource_AlarmSection0(): AlarmSection { return this._DataSource_AlarmSection0; }
    public set DataSource_AlarmSection0(value: AlarmSection) { this._DataSource_AlarmSection0 = value; }

    private _DataSource_AlarmSection1: AlarmSection = new AlarmSection(1);
    public get ATTR_DataSource_AlarmSection1__DisplayName(): string {return "Sensor value alarm 2"}
    public get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_DataSource_AlarmSection1__DescriptionAttribute(): string {return "Alarm 2 for this data source, expand for more."}
    public get DataSource_AlarmSection1(): AlarmSection { return this._DataSource_AlarmSection1; }
    public set DataSource_AlarmSection1(value: AlarmSection) { this._DataSource_AlarmSection1 = value; }

}

//****************************
//  Legend panel
//
//****************************

export class LegendPanelDescription
{

    public get summary(): string { return this._enabled ? "Enabled" : "Disabled"; }

    private _enabled: boolean = false;
    public get ATTR_enabled__DisplayName(): string { return "Enabled"}
    public get ATTR_enabled__ChangeCausesParentRefreshAttribute(): boolean { return true}
    public get ATTR_enabled__DescriptionAttribute(): string { return "Should the legend panel be shown or not" }
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean) { this._enabled = value; }

    private _overlap: boolean = false;
    public get ATTR_overlap__DisplayName(): string {return "Overlap"}
    public get ATTR_overlap__DescriptionAttribute(): string {return "Can the panel overlap the graph data, or should we explicitly make space for it?" }
    public get overlap(): boolean { return this._overlap; }
    public set overlap(value: boolean) { this._overlap = value; }

    private _position: YDataRendering.LegendPanel.PositionEnumItem = YDataRendering.LegendPanel.Position.RIGHT;
    public get ATTR_position__DisplayName(): string { return "Position"}
    public get ATTR_position__DescriptionAttribute(): string { return "Position of the legend panel"}
    public get position(): YDataRendering.LegendPanel.PositionEnumItem { return this._position; }
    public set position(value: YDataRendering.LegendPanel.PositionEnumItem) { this._position = value; }

    private _font: FontDescription = new FontDescription("Arial", 7, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, true);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Legend panel contents fonts"}
    public get font(): FontDescription { return this._font; }
    public set font(value: FontDescription) { this._font = value }

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
    public get ATTR_bgColor__DisplayName(): string {return "Background color "}
    public get ATTR_bgColor__DescriptionAttribute(): string {return "Legend panel background color." }
    public get bgColor(): YDataRendering.YColor { return this._bgColor }
    public set bgColor(value: YDataRendering.YColor) { this._bgColor = value }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_borderColor__DisplayName(): string {return "Border color "}
    public get ATTR_borderColor__DescriptionAttribute(): string {return "Legend panel border color." }
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor) { this._borderColor = value }

    private _borderthickness: number = 1.0;
    public get ATTR_borderthickness__DisplayName(): string {return "Border thickness "}
    public get ATTR_borderthickness__DescriptionAttribute(): string {return "Legend panel border thickness"}
    public get borderthickness(): number { return this._borderthickness; }
    public set borderthickness(value: number) { this._borderthickness = value; }

    private _padding: number = 10;
    public get ATTR_padding__DisplayName(): string {return "Padding "}
    public get ATTR_padding__DescriptionAttribute(): string {return "Distance between the panel border and the panel contents"}
    public get padding(): number { return this._padding; }
    public set padding(value: number) {this._padding = value; }

    private _verticalMargin: number = 10;
    public get ATTR_verticalMargin__DisplayName() {return "Vertical margin "}
    public get ATTR_verticalMargin__DescriptionAttribute() {return "Vertical distance between the panel border and its surroundings"}
    public get verticalMargin(): number { return this._verticalMargin; }
    public set verticalMargin(value: number) { this._verticalMargin = value; }

    private _horizontalMargin: number = 10;
    public get ATTR_horizontalMargin__DisplayName() {return "Horizontal margin "}
    public get ATTR_horizontalMargin__DescriptionAttribute() {return "Distance between the panel border and its surroundings"}
    public get horizontalMargin(): number { return this._horizontalMargin; }
    public set horizontalMargin(value: number) { this._horizontalMargin = value; }

    private _traceWidthFactor: number = 1;
    public get ATTR_traceWidthFactor__DisplayName(): string {return "Color Indicator Factor"}
    public get ATTR_traceWidthFactor__DescriptionAttribute(): string {return "Factor used to enlarge series color indicators shown in the legend panel"}
    public get traceWidthFactor(): number { return this._traceWidthFactor; }
    public set traceWidthFactor(value: number) { this._traceWidthFactor = value }

}

export class AnnotationPanelDescription
{

    public get summary(): string { return this._enabled ? "Enabled" : "Disabled";}

    protected _enabled: boolean = false;
    public get ATTR_enabled__DisplayName(): string {return "Enabled"}
    public get ATTR_enabled__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_enabled__DescriptionAttribute(): string {return "Should the annotation panel be shown or not"}
    public get enabled(): boolean {return this._enabled; }
    public set enabled(value: boolean) { this._enabled = value; }

    protected _overlap: boolean = false;
    public get ATTR_overlap__DisplayName(): string {return "Overlap"}
    public get ATTR_overlap__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_overlap__DescriptionAttribute(): string {return "Can the annotation panel overlap the display zone, or should the display zone be squeezed to make space for the panel?"}
    public get overlap(): boolean { return this._overlap; }
    public set overlap(value: boolean) { this._overlap = value }

    protected _text: string = "Date: $DAY$/$MONTH$/$YEAR$";
    public get ATTR_text__DisplayName(): string {return "Text "}
    public get ATTR_text__DescriptionAttribute(): string {return GenericHints.Annotation}
    public get text(): string { return this._text; }
    public set text(value: string) { this._text = value; }

    protected _panelTextAlign: YDataRendering.GenericPanel.TextAlignEnumItem = YDataRendering.GenericPanel.TextAlign.CENTER;
    public get ATTR_panelTextAlign__DisplayName(): string { return "Text Alignment"}
    public get ATTR_panelTextAlign__DescriptionAttribute(): string { return "How text is aligned, makes sense on multi-lines text only."}
    public get panelTextAlign(): YDataRendering.GenericPanel.TextAlignEnumItem { return this._panelTextAlign; }
    public set panelTextAlign(value: YDataRendering.GenericPanel.TextAlignEnumItem) { this._panelTextAlign = value; }

    private _panelHrzAlign: YDataRendering.GenericPanel.HorizontalAlignPosEnumItem = YDataRendering.GenericPanel.HorizontalAlignPos.CENTER;
    public get ATTR_panelHrzAlign__DisplayName(): string {return "X Position"}
    public get ATTR_panelHrzAlign__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_panelHrzAlign__DescriptionAttribute(): string {return "Annotation panel X position"}
    public get panelHrzAlign(): YDataRendering.GenericPanel.HorizontalAlignPosEnumItem { return this._panelHrzAlign; }
    public set panelHrzAlign(value: YDataRendering.GenericPanel.HorizontalAlignPosEnumItem) { this._panelHrzAlign = value; }

    private _positionOffsetX: number = 0;
    public get ATTR_positionOffsetX__DisplayName(): string {return "X Offset"}
    public get ATTR_positionOffsetX__DescriptionAttribute(): string {return "X Position offset, in %  (overlap mode only)"}
    public get positionOffsetX(): number { return this._positionOffsetX; }
    public set positionOffsetX(value: number) { this._positionOffsetX = value; }

    private _panelVrtAlign: YDataRendering.GenericPanel.VerticalAlignPosEnumItem = YDataRendering.GenericPanel.VerticalAlignPos.TOP;
    public get ATTR_panelVrtAlign__DisplayName(): string { return "Y Position"}
    public get ATTR_panelVrtAlign__ChangeCausesParentRefreshAttribute(): boolean { return true}
    public get ATTR_panelVrtAlign__DescriptionAttribute(): string { return "Annotation panel Y position"}
    public get panelVrtAlign(): YDataRendering.GenericPanel.VerticalAlignPosEnumItem { return this._panelVrtAlign; }
    public set panelVrtAlign(value: YDataRendering.GenericPanel.VerticalAlignPosEnumItem) { this._panelVrtAlign = value; }

    private _positionOffsetY: number = 0;
    public get ATTR_positionOffsetY__DisplayName(): string { return "Y Offset"}
    public get ATTR_positionOffsetY__DescriptionAttribute(): string { return "Y Position offset, in %  (overlap mode only)"}
    public get positionOffsetY(): number { return this._positionOffsetY; }
    public set positionOffsetY(value: number) { this._positionOffsetY = value; }

    private _font: FontDescription = new FontDescription("Arial", 12, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, false);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Panel font"}
    public get font(): FontDescription {return this._font;}
    public set font(value: FontDescription) { this._font = value;}

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
    public get ATTR_bgColor__DisplayName(): string {return "Background color "}
    public get ATTR_bgColor__DescriptionAttribute(): string {return "Legend panel background color." }
    public get bgColor(): YDataRendering.YColor { return this._bgColor; }
    public set bgColor(value: YDataRendering.YColor) { this._bgColor = value; }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_borderColor__DisplayName(): string { return "Border color "}
    public get ATTR_borderColor__DescriptionAttribute(): string { return "Legend panel border color." }
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor) { this._borderColor = value; }

    private _borderthickness: number = 1.0;
    public get ATTR_borderthickness__DisplayName(): string { return "Border thickness "}
    public get ATTR_borderthickness__DescriptionAttribute(): string { return "Panel border thickness"}
    public get borderthickness(): number { return this._borderthickness; }
    public set borderthickness(value: number) { this._borderthickness = value; }

    private _padding: number = 5;
    public get ATTR_padding__DisplayName(): string { return "Padding ";}
    public get ATTR_padding__DescriptionAttribute(): string { return "Distance between the panel border and the panel contents"}
    public get padding(): number { return this._padding; }
    public set padding(value: number) { this._padding = value; }

    constructor(hrzAlignInit?: YDataRendering.GenericPanel.HorizontalAlignPosEnumItem,
                vrtAlignInit?: YDataRendering.GenericPanel.VerticalAlignPosEnumItem,
                offsetY?: number, overlap?: boolean, textInit?: string,
                BgColorInit?: YDataRendering.YColor, BorderColorInit?: YDataRendering.YColor,
                fontSizeInit?: number, FontColorInit?: YDataRendering.YColor)

    { // allows alternate default value
        if (typeof textInit != "undefined") this._text = textInit;
        if (typeof offsetY != "undefined") this._positionOffsetY = offsetY;
        if (typeof overlap != "undefined") this._overlap = overlap;
        if (typeof BgColorInit != "undefined") this._bgColor = BgColorInit;
        if (typeof BorderColorInit != "undefined") this._borderColor = BorderColorInit;
        if (typeof fontSizeInit != "undefined") this._font.size = fontSizeInit;
        if (typeof FontColorInit != "undefined") this._font.color = FontColorInit;
        if (typeof vrtAlignInit != "undefined") this._panelVrtAlign = vrtAlignInit;
        if (typeof hrzAlignInit != "undefined") this._panelHrzAlign = hrzAlignInit;
    }

}

export class AnnotationPanelDescriptionGraph extends AnnotationPanelDescription
{ // overridden  property will be moved back in first
  // position,

    public get ATTR_enabled__DisplayName(): string {return "Enabled"}
    public get ATTR_enabled__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_enabled__DescriptionAttribute(): string {return "Should the annotation panel be shown or not"}
    public get enabled(): boolean { return this._enabled }
    public set enabled(value: boolean) { this._enabled = value }

    public get ATTR_overlap__DisplayName(): string {return "Overlap"}
    public get ATTR_overlap__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_overlap__DescriptionAttribute(): string {return "Can the annotation panel overlap the graph, or should the graph be squeezed to make space for the panel?"}
    public get overlap(): boolean {return this._overlap; }
    public set overlap(value: boolean) { this._overlap = value }

    public get ATTR_text__DisplayName(): string {return "Text "}
    public get ATTR_text__DescriptionAttribute(): string {return GenericHints.AnnotationGraph}
    public get text(): string { return this._text; }
    public set text(value: string) { this._text = value; }

}

export class DataTrackerDescription
{

    public get summary(): string { return this._enabled ? "Enabled" : "Disabled";}

    private _enabled: boolean = false;
    public get ATTR_enabled__DisplayName() {return "Enabled"}
    public get ATTR_enabled__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_enabled__DescriptionAttribute() {return "Should the data tracker be shown or not." }
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean) { this._enabled = value; }

    private _showSerieName: boolean = false;
    public get ATTR_showSerieName__DisplayName(): string {return "Show Series legend"}
    public get ATTR_showSerieName__DescriptionAttribute(): string {return "Should the data tracker show the value's series legend."}
    public get showSerieName(): boolean { return this._showSerieName; }
    public set showSerieName(value: boolean) { this._showSerieName = value; }

    private _showTimeStamp: boolean = false;
    public get ATTR_showTimeStamp__DisplayName(): string { return "Show Timestamp"}
    public get ATTR_showTimeStamp__DescriptionAttribute(): string { return "Should the data tracker show the value's timestamp."}
    public get showTimeStamp(): boolean { return this._showTimeStamp; }
    public set showTimeStamp(value: boolean) { this._showTimeStamp = value; }

    private _dataPrecision: DataTrackerDescription.DataPrecisionEnumItem = DataTrackerDescription.DataPrecision.PRECISION_NOLIMIT;
    public get ATTR_dataPrecision__DisplayName(): string { return "Precision"}
    public get ATTR_dataPrecision__DescriptionAttribute(): string { return "A way to limit data precision to meaningful digits in the data tracker."}
    public get dataPrecision(): DataTrackerDescription.DataPrecisionEnumItem { return this._dataPrecision; }
    public set dataPrecision(value: DataTrackerDescription.DataPrecisionEnumItem) { this._dataPrecision = value; }

    private _diameter: number = 5;
    public get ATTR_diameter__DisplayName(): string {return "Point Diameter"}
    public get ATTR_diameter__DescriptionAttribute(): string { return "Data point diameter, in pixels"}
    public get diameter(): number { return this._diameter; }
    public set diameter(value: number) { this._diameter = value; }

    private _handleLength: number = 25;
    public get ATTR_handleLength__DisplayName(): string {return "Handle size"}
    public get ATTR_handleLength__DescriptionAttribute(): string {return "size of the handle between the data point and the value panel"}
    public get handleLength(): number { return this._handleLength; }
    public set handleLength(value: number) { this._handleLength = value; }

    private _font: FontDescription = new FontDescription("Arial", 7, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, false);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Data tracker label fonts"}
    public get font(): FontDescription { return this._font;}
    public set font(value: FontDescription) { this._font = value;}

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
    public get ATTR_bgColor__DisplayName(): string {return "Background color"}
    public get ATTR_bgColor__DescriptionAttribute(): string {return "Value panel ground color." }
    public get bgColor(): YDataRendering.YColor { return this._bgColor; }
    public set bgColor(value: YDataRendering.YColor) { this._bgColor = value; }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_borderColor__DisplayName(): string {return "Border color"}
    public get ATTR_borderColor__DescriptionAttribute(): string {return "Value panel border and handle  color." }
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor) { this._borderColor = value; }

    private _borderthickness: number = 1.0;
    public get ATTR_borderthickness__DisplayName(): string {return "Border thickness "}
    public get ATTR_borderthickness__DescriptionAttribute(): string {return "Value panel border and handle  thickness"}
    public get borderthickness(): number { return this._borderthickness; }
    public set borderthickness(value: number) { this._borderthickness = value }

    private _padding: number = 5;
    public get ATTR_padding__DisplayName(): string {return "Padding"}
    public get ATTR_padding__DescriptionAttribute(): string {return "Distance between the panel border and its contents "}
    public get padding(): number { return this._padding; }
    public set padding(value: number) { this._padding = value; }

    private _detectionDistance: number = 50;
    public get ATTR_detectionDistance__DisplayName(): string {return "Detection distance"}
    public get ATTR_detectionDistance__DescriptionAttribute(): string {return "Maximum distance, in pixels, between the mouse and a data point for data tracker to show. Use zero for infinite distance"}
    public get detectionDistance(): number { return this._detectionDistance; }
    public set detectionDistance(value: number) { this._detectionDistance = value; }

}

export namespace DataTrackerDescription
{

    export class DataPrecisionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, DataPrecision)

        }
    }

    export class DataPrecision extends YDataRendering.YEnum
    {
        public static readonly PRECISION_NOLIMIT: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_NOLIMIT", "As is");
        public static readonly PRECISION_1: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_1", "1");
        public static readonly PRECISION_01: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_01", "0.1");
        public static readonly PRECISION_001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_001", "0.01");
        public static readonly PRECISION_0001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_0001", "0.001");
    }

}

//****************************
//  graph navigator
//
//****************************

export class NavigatorDescription
{
    public get summary(): string { return this._enabled ? "Enabled" : "Disabled"; }

    constructor() {}

    private _enabled: boolean = false;
    public get ATTR_enabled__DisplayName(): string { return "Enabled"}
    public get ATTR_enabled__ChangeCausesParentRefreshAttribute(): boolean { return true}
    public get ATTR_enabled__DescriptionAttribute(): string { return "Should the navigator be shown or not." }
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean) { this._enabled = value; }

    private _bgColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
    public get ATTR_bgColor1__DisplayName(): string {return "Background color 1"}
    public get ATTR_bgColor1__DescriptionAttribute(): string {return "Navigator background gradient color 1." }
    public get bgColor1(): YDataRendering.YColor { return this._bgColor1; }
    public set bgColor1(value: YDataRendering.YColor) { this._bgColor1 = value; }

    private _bgColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
    public get ATTR_bgColor2__DisplayName(): string {return "Background color 2"}
    public get ATTR_bgColor2__DescriptionAttribute(): string {return "Navigator background gradient color 2." }
    public get bgColor2(): YDataRendering.YColor { return this._bgColor2; }
    public set bgColor2(value: YDataRendering.YColor) { this._bgColor2 = value; }

    private _borderThickness: number = 1.0;
    public get ATTR_borderThickness__DisplayName(): string {return "Border thickness"}
    public get ATTR_borderThickness__DescriptionAttribute(): string {return "Navigator"}
    public get borderThickness(): number { return this._borderThickness; }
    public set borderThickness(value: number) { this._borderThickness = value; }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_borderColor__DisplayName(): string {return "Border color"}
    public get ATTR_borderColor__DescriptionAttribute(): string {return "Navigator Border color." }
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor) { this._borderColor = value; }

    private _cursorColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(25, 0, 255, 0);
    public get ATTR_cursorColor__DisplayName(): string {return "Navigator cursor fill color"}
    public get ATTR_cursorColor__DescriptionAttribute(): string {return "Navigator"}
    public get cursorColor(): YDataRendering.YColor { return this._cursorColor; }
    public set cursorColor(value: YDataRendering.YColor) { this._cursorColor = value; }

    private _cursorBorderColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 96, 96, 96);
    public get ATTR_cursorBorderColor__DisplayName(): string {return "Navigator cursor left/right border color." }
    public get ATTR_cursorBorderColor__DescriptionAttribute(): string {return "Navigator" }
    public get cursorBorderColor(): YDataRendering.YColor { return this._cursorBorderColor; }
    public set cursorBorderColor(value: YDataRendering.YColor) { this._cursorBorderColor = value; }

    private _yAxisHandling: YDataRendering.Navigator.YAxisHandlingEnumItem = YDataRendering.Navigator.YAxisHandling.AUTO;
    public get ATTR_yAxisHandling__DisplayName(): string {return "Y axis range"}
    public get ATTR_yAxisHandling__DescriptionAttribute(): string {return "Is navigator Y axis zoom automatic or inherited from main view settings?"}
    public get yAxisHandling(): YDataRendering.Navigator.YAxisHandlingEnumItem { return this._yAxisHandling; }
    public set yAxisHandling(value: YDataRendering.Navigator.YAxisHandlingEnumItem) { this._yAxisHandling = value; }

    private _xAxisThickness: number = 1.0;
    public get ATTR_xAxisThickness__DisplayName(): string {return "X axis thickness"}
    public get ATTR_xAxisThickness__DescriptionAttribute(): string {return "Navigator"}
    public get xAxisThickness(): number { return this._xAxisThickness; }
    public set xAxisThickness(value: number) { this._xAxisThickness = value; }

    private _xAxisColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get ATTR_xAxisColor__DisplayName(): string {return "X axis color"}
    public get ATTR_xAxisColor__DescriptionAttribute(): string {return "Navigator X axis color." }
    public get xAxisColor(): YDataRendering.YColor { return this._xAxisColor; }
    public set xAxisColor(value: YDataRendering.YColor) { this._xAxisColor = value; }

    private _font: FontDescription = new FontDescription("Arial", 10, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, false);
    public get ATTR_font__DisplayName(): string {return "X-Axis Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Navigator X axis font"}
    public get font(): FontDescription { return this._font; }
    public set font(value: FontDescription) { this._font = value; }

}

//****************************
//  graph Legend
//
//****************************

export class LegendDescription
{
    private _title: string = "";
    public get ATTR_title__DisplayName(): string {return "Text"}
    public get ATTR_title__DescriptionAttribute(): string {return "Legend text"}
    public get title(): string { return this._title; }
    public set title(value: string) { this._title = value; }

    private _font: FontDescription = new FontDescription("Arial", 12, YDataRendering.YColor.Black, false, true);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Legend font"}
    public get font(): FontDescription { return this._font; }
    public set font(value: FontDescription) { this._font = value }

}

//****************************
//  graph Y-axis
//
//****************************

export class YaxisDescription
{

    public constructor(index: number, shown: boolean)
    {
        this._visible = shown;
        this._showGrid = index == 0;
        this._position = index == 0 ? YDataRendering.YAxis.HrzPosition.LEFT : YDataRendering.YAxis.HrzPosition.RIGHT;
    }

    public get summary(): string { return this._visible ? "Enabled" : "Disabled"; }

    private _visible: boolean = false;
    public get ATTR_visible__DisplayName(): string {return "Visible"}
    public get ATTR_visible__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_visible__DescriptionAttribute(): string {return "Should that YAxis be shown?." }
    public get visible(): boolean { return this._visible; }
    public set visible(value: boolean) { this._visible = value; }

    private _position: YDataRendering.YAxis.HrzPositionEnumItem = YDataRendering.YAxis.HrzPosition.LEFT;
    public get ATTR_position__DisplayName(): string {return "Position"}
    public get ATTR_position__DescriptionAttribute(): string {return "Y Axis position (left / right)"}
    public get position(): YDataRendering.YAxis.HrzPositionEnumItem { return this._position; }
    public set position(value: YDataRendering.YAxis.HrzPositionEnumItem) { this._position = value; }

    private _min: YoctoVisualization.doubleNan = new YoctoVisualization.doubleNan(Number.NaN);
    public get ATTR_min__DisplayName(): string {return "Minimum value"}
    public get ATTR_min__DescriptionAttribute(): string {return "YAxis minimum value, leave blank for automatic behavior."}
    public get min(): YoctoVisualization.doubleNan { return this._min; }
    public set min(value: YoctoVisualization.doubleNan) { this._min = value; }

    private _max: YoctoVisualization.doubleNan = new YoctoVisualization.doubleNan(Number.NaN);
    public get ATTR_max__DisplayName(): string {return "Maximum value"}
    public get ATTR_max__DescriptionAttribute(): string {return "YAxis maximum value, leave blank for automatic behavior."}
    public get max(): YoctoVisualization.doubleNan { return this._max; }
    public set max(value: YoctoVisualization.doubleNan) { this._max = value; }

    private _step: YoctoVisualization.doubleNan = new YoctoVisualization.doubleNan(Number.NaN);
    public get ATTR_step__DisplayName(): string {return "Steps"}
    public get ATTR_step__DescriptionAttribute(): string {return "YAxis step size, leave blank for automatic behavior."}
    public get step(): YoctoVisualization.doubleNan {return this._step;}
    public set step(value: YoctoVisualization.doubleNan) {this._step = value;}

    private _color: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 127, 127, 127);
    public get ATTR_color__DisplayName(): string {return "Color"}
    public get ATTR_color__DescriptionAttribute(): string {return "Y Axis Color." }
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value: YDataRendering.YColor) { this._color = value; }

    private _thickness: number = 1.0;
    public get ATTR_thickness__DisplayName(): string {return "Thickness"}
    public get ATTR_thickness__DescriptionAttribute(): string {return "Axis thickness"}
    public get thickness(): number { return this._thickness; }
    public set thickness(value: number) { this._thickness = value; }

    private _showGrid: boolean = false;
    public get ATTR_showGrid__DisplayName(): string {return "Show Grid"}
    public get ATTR_showGrid__DescriptionAttribute(): string {return "Show grid horizontal lines, or not." }
    public get showGrid(): boolean { return this._showGrid; }
    public set showGrid(value: boolean) { this._showGrid = value; }

    private _gridColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 210, 210, 210);
    public get ATTR_gridColor__DisplayName(): string {return "Grid Color"}
    public get ATTR_gridColor__DescriptionAttribute(): string {return "Grid horizontal lines color." }
    public get gridColor(): YDataRendering.YColor { return this._gridColor; }
    public set gridColor(value: YDataRendering.YColor) { this._gridColor = value; }

    private _gridThickness: number = 1.0;
    public get ATTR_gridThickness__DisplayName(): string {return "Grid thickness"}
    public get ATTR_gridThickness__DescriptionAttribute(): string {return "Grid horizontal lines thickness"}
    public get gridThickness(): number { return this._gridThickness; }
    public set gridThickness(value: number) { this._gridThickness = value; }

    private _font: FontDescription = new FontDescription("Arial", 10, YDataRendering.YColor.Black, false, false);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Axis font"}
    public get font(): FontDescription { return this._font; }
    public set font(value: FontDescription) { this._font = value; }

    private _legend: LegendDescription = new LegendDescription();
    public get ATTR_legend__DisplayName(): string {return "Legend"}
    public get ATTR_legend__DescriptionAttribute(): string {return "Axis legend"}
    public get legend(): LegendDescription { return this._legend; }
    public set legend(value: LegendDescription) { this._legend = value; }

    private _zones0: ZoneDescription = new ZoneDescription(0, 50, YDataRendering.YColor.LightGreen);
    public get ATTR_zones0__DisplayName(): string {return "Zone 1"}
    public get ATTR_zones0__CategoryAttribute(): string {return "Zones"}
    public get ATTR_zones0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_zones0__DescriptionAttribute(): string {return "Zone 1 parameters"}
    public get zones0(): ZoneDescription { return this._zones0; }
    public set zones0(value: ZoneDescription) { this._zones0 = value; }

    private _zones1: ZoneDescription = new ZoneDescription(50, 80, YDataRendering.YColor.Yellow);
    public get ATTR_zones1__DisplayName(): string {return "Zone 2"}
    public get ATTR_zones1__CategoryAttribute(): string {return "Zones"}
    public get ATTR_zones1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_zones1__DescriptionAttribute(): string {return "Zone 2 parameters"}
    public get zones1(): ZoneDescription { return this._zones1; }
    public set zones1(value: ZoneDescription) { this._zones1 = value; }

    private _zones2: ZoneDescription = new ZoneDescription(80, 100, YDataRendering.YColor.Red);
    public get ATTR_zones2__DisplayName(): string {return "Zone 3"}
    public get ATTR_zones2__CategoryAttribute(): string {return "Zones"}
    public get ATTR_zones2__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_zones2__DescriptionAttribute(): string {return "Zone 3 parameters"}
    public get zones2(): ZoneDescription { return this._zones2; }
    public set zones2(value: ZoneDescription) { this._zones2 = value; }

}

//****************************
//  graph X-axis markers
//
//****************************

export class MarkerDescription
{

    constructor(defaultText: string) { this._text = defaultText; }

    public get summary(): string { return this._enabled ? "Enabled" : "Disabled"; }

    private _enabled: boolean = false;
    public get ATTR_enabled__DisplayName(): string { return "Enabled"}
    public get ATTR_enabled__ChangeCausesParentRefreshAttribute(): boolean { return true}
    public get ATTR_enabled__DescriptionAttribute(): string {return "Should that marker be shown?."}
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean) { this._enabled = value; }

    private _text: string = "";
    public get ATTR_text__DisplayName(): string { return "Text"}
    public get ATTR_text__DescriptionAttribute(): string { return "Marker text. Use \\n for multi-line text. Some variables are allowed such as $MARKERTIME$, $LEGEND1$, $VALUE1$, $UNIT1$, $LEGEND1$, $VALUE2$ etc.. Extensive use of marker variables migh make the graph rendering significantly slower."}
    public get text(): string { return this._text; }
    public set text(value: string) { this._text = value }

    private _textAlign: YDataRendering.Marker.TextAlignEnumItem = YDataRendering.Marker.TextAlign.CENTER;
    public get ATTR_textAlign__DisplayName(): string { return "Text Alignment"}
    public get ATTR_textAlign__DescriptionAttribute(): string { return "How text is aligned, makes sense on multi-lines text only."}
    public get textAlign(): YDataRendering.Marker.TextAlignEnumItem { return this._textAlign; }
    public set textAlign(value: YDataRendering.Marker.TextAlignEnumItem) { this._textAlign = value; }

    private _timereference: YDataRendering.TimeConverter.TimeReferenceEnumItem = YDataRendering.TimeConverter.TimeReference.ABSOLUTE;
    public get ATTR_timereference__DisplayName(): string {return "Time reference"}
    public get ATTR_timereference__ChangeCausesParentRefreshAttribute(): boolean {return true}
    public get ATTR_timereference__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_timereference__DescriptionAttribute(): string {return "Should the marker time position be absolute or relative to first data timestamp? Note: relative markers won't be drawn until there is actual data."}
    public get timereference(): YDataRendering.TimeConverter.TimeReferenceEnumItem { return this._timereference; }
    public set timereference(value: YDataRendering.TimeConverter.TimeReferenceEnumItem)
    {
        this._timereference = value;
        this._positionOnXAxis.relative = value == (YDataRendering.TimeConverter.TimeReference.RELATIVE);
    }

    private _positionOnXAxis: YDataRendering.xAxisPosition = new YDataRendering.xAxisPosition(YDataRendering.TimeConverter.ToUnixTime(new Date()), false);
    public get ATTR_positionOnXAxis__DisplayName(): string {return "Time position"}
    public get ATTR_positionOnXAxis__DescriptionAttribute(): string {return "Marker position on X axis." }
    public get positionOnXAxis(): YDataRendering.xAxisPosition { return this._positionOnXAxis; }
    public set positionOnXAxis(value: YDataRendering.xAxisPosition)
    {
        this._positionOnXAxis = value;
        this.timereference = value.relative ? YDataRendering.TimeConverter.TimeReference.RELATIVE : YDataRendering.TimeConverter.TimeReference.ABSOLUTE;
    }

    private _yposition: number = 95;
    public get ATTR_yposition__DisplayName(): string {return "Vrt position (%)"}
    public get ATTR_yposition__DescriptionAttribute(): string {return "Vertical position of the marker label in % of available space. Zero is bottom"}
    public get yposition(): number { return this._yposition; }
    public set yposition(value: number) { this._yposition = value; }

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(200, 255, 255, 192);
    public get ATTR_bgColor__DisplayName() {return "Background color "}
    public get ATTR_bgColor__DescriptionAttribute() {return "Marker  background color." }
    public get bgColor(): YDataRendering.YColor { return this._bgColor; }
    public set bgColor(value: YDataRendering.YColor) { this._bgColor = value; }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.DarkRed;
    public get ATTR_borderColor__DisplayName(): string {return "Border color "}
    public get ATTR_borderColor__DescriptionAttribute(): string {return "Marker border color." }
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor) { this._borderColor = value; }

    private _borderthickness: number = 1.0;
    public get ATTR_borderthickness__DisplayName(): string {return "Border thickness "}
    public get ATTR_borderthickness__DescriptionAttribute(): string {return "Marker border thickness, in pixels."}
    public get borderthickness(): number { return this._borderthickness; }
    public set borderthickness(value: number) { this._borderthickness = value; }

    private _padding: number = 5;
    public get ATTR_padding__DisplayName(): string {return "Padding "}
    public get ATTR_padding__DescriptionAttribute(): string {return "Distance between the marker border and the marker contents, in pixels."}
    public get padding(): number { return this._padding; }
    public set padding(value: number) { this._padding = value; }

    private _font: FontDescription = new FontDescription("Arial", 7, YDataRendering.YColor.Black, false, false);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Marker Font"}
    public get font(): FontDescription { return this._font; }
    public set font(value: FontDescription) { this._font = value }

}

//****************************
//  graph X-axis
//
//****************************

export class XaxisDescription

{
    private _initialZoom: number = 60;
    public get ATTR_initialZoom__DisplayName(): string {return "Initial Zoom"}
    public get ATTR_initialZoom__DescriptionAttribute(): string {return "Zoom level at application startup, i.e. width of the view-port in seconds."}
    public get initialZoom(): number { return this._initialZoom; }
    public set initialZoom(value: number) { this._initialZoom = value; }

    private _initialOffset: number = 0;
    public get ATTR_initialOffset__DisplayName(): string {return "Initial Offset"}
    public get ATTR_initialOffset__DescriptionAttribute(): string {return "Offset of the first data point in percentage of the viewport width. For instance a 50% value will put the first point in the middle of the viewport. This can be used to give some room for datalogger contents."}
    public get initialOffset(): number { return this._initialOffset; }
    public set initialOffset(value: number) { this._initialOffset = value; }

    private _position: YDataRendering.XAxis.VrtPositionEnumItem = YDataRendering.XAxis.VrtPosition.BOTTOM;
    public get ATTR_position__DisplayName(): string {return "Position"}
    public get ATTR_position__DescriptionAttribute(): string {return "X Axis position (top / bottom)"}
    public get position(): YDataRendering.XAxis.VrtPositionEnumItem { return this._position; }
    public set position(value: YDataRendering.XAxis.VrtPositionEnumItem) { this._position = value; }

    private _timeReference: YDataRendering.TimeConverter.TimeReferenceEnumItem = YDataRendering.TimeConverter.TimeReference.ABSOLUTE;
    public get ATTR_timeReference__DisplayName(): string {return "Time reference"}
    public get ATTR_timeReference__DescriptionAttribute(): string {return "Are gradation timestamps absolute or relative to experiment start time? "}
    public get timeReference(): YDataRendering.TimeConverter.TimeReferenceEnumItem { return this._timeReference;}
    public set timeReference(value: YDataRendering.TimeConverter.TimeReferenceEnumItem) { this._timeReference = value;}

    private _overflowHandling: YDataRendering.XAxis.OverflowHandlingEnumItem = YDataRendering.XAxis.OverflowHandling.SCROLL;
    public get ATTR_overflowHandling__DisplayName(): string {return "Overflow Handling"}
    public get ATTR_overflowHandling__DescriptionAttribute(): string {return "What to do when new data are about to reach the graph right border"}
    public get overflowHandling(): YDataRendering.XAxis.OverflowHandlingEnumItem {return this._overflowHandling;}
    public set overflowHandling(value: YDataRendering.XAxis.OverflowHandlingEnumItem) { this._overflowHandling = value;}

    private _color: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 127, 127, 127);
    public get ATTR_color__DisplayName(): string {return "Color"}
    public get ATTR_color__DescriptionAttribute(): string {return "X Axis Color." }
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value: YDataRendering.YColor) { this._color = value; }

    private _thickness: number = 1.0;
    public get ATTR_thickness__DisplayName(): string {return "Thickness"}
    public get ATTR_thickness__DescriptionAttribute(): string {return "Axis thickness"}
    public get thickness(): number { return this._thickness; }
    public set thickness(value: number) { this._thickness = value; }

    private _showGrid: boolean = false;
    public get ATTR_showGrid__DisplayName(): string {return "Show Grid"}
    public get ATTR_showGrid__DescriptionAttribute(): string {return "Show grid vertical lines, or not." }
    public get showGrid(): boolean { return this._showGrid; }
    public set showGrid(value: boolean) { this._showGrid = value }

    private _gridColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(50, 0, 0, 0);
    public get ATTR_gridColor__DisplayName(): string {return "Grid Color"}
    public get ATTR_gridColor__DescriptionAttribute(): string {return "Grid vertical lines color." }
    public get gridColor(): YDataRendering.YColor { return this._gridColor; }
    public set gridColor(value: YDataRendering.YColor) { this._gridColor = value; }

    private _gridThickness: number = 1.0;
    public get ATTR_gridThickness__DisplayName(): string {return "Grid thickness"}
    public get ATTR_gridThickness__DescriptionAttribute(): string {return "Grid vertical lines thickness"}
    public get gridThickness(): number { return this._gridThickness; }
    public set gridThickness(value: number) { this._gridThickness = value }

    private _font: FontDescription = new FontDescription("Arial", 10, YDataRendering.YColor.Black, false, false);
    public get ATTR_font__DisplayName(): string {return "Font"}
    public get ATTR_font__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_font__DescriptionAttribute(): string {return "Axis font"}
    public get font(): FontDescription { return this._font; }
    public set font(value: FontDescription) { this._font = value; }

    private _legend: LegendDescription = new LegendDescription();
    public get ATTR_legend__DisplayName(): string {return "Legend"}
    public get ATTR_legend__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_legend__DescriptionAttribute(): string {return "X Axis legend"}
    public get legend(): LegendDescription { return this._legend; }
    public set legend(value: LegendDescription) { this._legend = value; }

    private _markers0: MarkerDescription = new MarkerDescription("Marker 1");
    public get ATTR_markers0__DisplayName(): string {return "Marker 1"}
    public get ATTR_markers0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers0__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers0__DescriptionAttribute(): string {return "First marker parameters"}
    public get markers0(): MarkerDescription { return this._markers0; }
    public set markers0(value: MarkerDescription) { this._markers0 = value; }

    private _markers1: MarkerDescription = new MarkerDescription("Marker 2");
    public get ATTR_markers1__DisplayName(): string {return "Marker 2"}
    public get ATTR_markers1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers1__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers1__DescriptionAttribute(): string {return "Second marker parameters"}
    public get markers1(): MarkerDescription { return this._markers1; }
    public set markers1(value: MarkerDescription) { this._markers1 = value; }

    private _markers2: MarkerDescription = new MarkerDescription("Marker 3");
    public get ATTR_markers2__DisplayName(): string {return "Marker 3"}
    public get ATTR_markers2__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers2__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers2__DescriptionAttribute(): string {return "Third marker parameters"}
    public get markers2(): MarkerDescription { return this._markers2; }
    public set markers2(value: MarkerDescription) { this._markers2 = value; }

    private _markers3: MarkerDescription = new MarkerDescription("Marker 4");
    public get ATTR_markers3__DisplayName(): string {return "Marker 4"}
    public get ATTR_markers3__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers3__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers3__DescriptionAttribute(): string {return "Fourth marker parameters"}
    public get markers3(): MarkerDescription { return this._markers3; }
    public set markers3(value: MarkerDescription) { this._markers3 = value; }

    private _markers4: MarkerDescription = new MarkerDescription("Marker 5");
    public get ATTR_markers4__DisplayName(): string {return "Marker 5"}
    public get ATTR_markers4__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers4__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers4__DescriptionAttribute(): string {return "Fith marker parameters"}
    public get markers4(): MarkerDescription { return this._markers4; }
    public set markers4(value: MarkerDescription) { this._markers4 = value; }

    private _markers5: MarkerDescription = new MarkerDescription("Marker 6");
    public get ATTR_markers5__DisplayName(): string {return "Marker 6"}
    public get ATTR_markers5__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers5__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers5__DescriptionAttribute(): string {return "Sixth marker parameters"}
    public get markers5(): MarkerDescription { return this._markers5; }
    public set markers5(value: MarkerDescription) { this._markers5 = value; }

    private _markers6: MarkerDescription = new MarkerDescription("Marker 7");
    public get ATTR_markers6__DisplayName(): string {return "Marker 7"}
    public get ATTR_markers6__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers6__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers6__DescriptionAttribute(): string {return "Seventh marker parameters"}
    public get markers6(): MarkerDescription { return this._markers6; }
    public set markers6(value: MarkerDescription) { this._markers6 = value; }

    private _markers7: MarkerDescription = new MarkerDescription("Marker 8");
    public get ATTR_markers7__DisplayName(): string {return "Marker 8"}
    public get ATTR_markers7__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_markers7__CategoryAttribute(): string {return "Markers"}
    public get ATTR_markers7__DescriptionAttribute(): string {return "Height marker parameters"}
    public get markers7(): MarkerDescription { return this._markers7; }
    public set markers7(value: MarkerDescription) { this._markers7 = value; }

}

//****************************
//  graph display
//
//****************************

export class GraphFormProperties extends YoctoVisualization.GenericProperties
{
    constructor(initData: YoctoVisualization.YXmlNode | null, owner: YoctoVisualization.YWidget | null)
    {
        super(owner)
        this.initFromXmlData(initData)
    }

    public IsDataSourceAssigned(): boolean
    {
        let propList: string[] = Object.getOwnPropertyNames(this);
        propList.forEach((name: string) =>
        {
            if (name.startsWith("Graphs_series"))
            {
                let s: ChartSerie = (<any>this)[name].GetValue(this, null);
                if (!(s.DataSource_source instanceof YoctoVisualization.NullYSensor)) return true;
            }
        })
        return false;
    }

    private _Graph_series0: ChartSerie = new ChartSerie(YDataRendering.YColor.Tomato);
    public get ATTR_Graph_series0__DisplayName(): string {return "Series 1"}
    public get ATTR_Graph_series0__CategoryAttribute(): string {return "Data Sources"}
    public get ATTR_Graph_series0__PreExpandedCategoryAttribute(): boolean {return true}
    public get ATTR_Graph_series0__PreExpandedAttribute(): boolean {return true}
    public get ATTR_Graph_series0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_series0__DescriptionAttribute(): string {return "First data series, expand for more."}
    public get Graph_series0(): ChartSerie { return this._Graph_series0 }
    public set Graph_series0(value: ChartSerie) { this._Graph_series0 = value }

    private _Graph_series1: ChartSerie = new ChartSerie(YDataRendering.YColor.DodgerBlue);
    public get ATTR_Graph_series1__DisplayName(): string {return "Series 2"}
    public get ATTR_Graph_series1__CategoryAttribute(): string {return "Data Sources"}
    public get ATTR_Graph_series1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_series1__DescriptionAttribute(): string {return "Second data series, expand for more."}
    public get Graph_series1(): ChartSerie { return this._Graph_series1 }
    public set Graph_series1(value: ChartSerie) { this._Graph_series1 = value }

    private _Graph_series2: ChartSerie = new ChartSerie(YDataRendering.YColor.SeaGreen);
    public get ATTR_Graph_series2__DisplayName(): string {return "Series 3"}
    public get ATTR_Graph_series2__CategoryAttribute(): string {return "Data Sources"}
    public get ATTR_Graph_series2__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_series2__DescriptionAttribute(): string {return "Third data series, expand for more."}
    public get Graph_series2(): ChartSerie { return this._Graph_series2 }
    public set Graph_series2(value: ChartSerie) { this._Graph_series2 = value }

    private _Graph_series3: ChartSerie = new ChartSerie(YDataRendering.YColor.Gold);
    public get ATTR_Graph_series3__DisplayName(): string {return "Series 4"}
    public get ATTR_Graph_series3__CategoryAttribute(): string {return "Data Sources"}
    public get ATTR_Graph_series3__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_series3__DescriptionAttribute(): string {return "Fourth data series, expand for more."}
    public get Graph_series3(): ChartSerie { return this._Graph_series3 }
    public set Graph_series3(value: ChartSerie) { this._Graph_series3 = value }

    private _Graph_showRecordedData: boolean = false;
    public get ATTR_Graph_showRecordedData__DisplayName(): string {return "Use datalogger data"}
    public get ATTR_Graph_showRecordedData__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_showRecordedData__CopyToTarget(): boolean {return false}  // this extra property doesn't exist is graph
    public get ATTR_Graph_showRecordedData__DescriptionAttribute(): string {return "Makes the graph load the sensors datalogger contents. After disabling this feature, you may want to reset the dataview with the right-click context menu." }
    public get Graph_showRecordedData(): boolean { return this._Graph_showRecordedData; }
    public set Graph_showRecordedData(value: boolean)
    {
        if (this._Graph_showRecordedData != value)
        {
            this._Graph_showRecordedData = value;
            if (this.ownerForm != null)
            {
                this._Graph_showRecordedData ? this.ownerForm.loadRecordedDataIfNeeded() :this.ownerForm.removeDataloggerData() ;
            }
        }
    }

    private _Graph_borderColor: YDataRendering.YColor = YDataRendering.YColor.LightGray;
    public get ATTR_Graph_borderColor__DisplayName(): string {return "Border color"}
    public get ATTR_Graph_borderColor__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_borderColor__DescriptionAttribute(): string {return "Canvas borders color."}
    public get Graph_borderColor(): YDataRendering.YColor {return this._Graph_borderColor;}
    public set Graph_borderColor(value: YDataRendering.YColor) {this._Graph_borderColor = value}

    private _Graph_borderThickness: number = 1.0;
    public get ATTR_Graph_borderThickness__DisplayName(): string {return "Border thickness"}
    public get ATTR_Graph_borderThickness__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_borderThickness__DescriptionAttribute(): string {return "Canvas borders thickness."}
    public get Graph_borderThickness(): number {return this._Graph_borderThickness;}
    public set Graph_borderThickness(value: number) { this._Graph_borderThickness = value}

    private _Graph_bgColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 220, 220, 220);
    public get ATTR_Graph_bgColor1__DisplayName(): string {return "Background color 1"}
    public get ATTR_Graph_bgColor1__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_bgColor1__DescriptionAttribute(): string {return "Background gradient color 1." }
    public get Graph_bgColor1(): YDataRendering.YColor { return this._Graph_bgColor1; }
    public set Graph_bgColor1(value: YDataRendering.YColor) { this._Graph_bgColor1 = value; }

    private _Graph_bgColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(55, 240, 240, 240);
    public get ATTR_Graph_bgColor2__DisplayName(): string {return "Background color 2"}
    public get ATTR_Graph_bgColor2__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_bgColor2__DescriptionAttribute(): string {return "Background gradient color 2." }
    public get Graph_bgColor2(): YDataRendering.YColor { return this._Graph_bgColor2; }
    public set Graph_bgColor2(value: YDataRendering.YColor) { this._Graph_bgColor2 = value; }

    private _Graph_resizeRule: YDataRendering.Proportional.ResizeRuleEnumItem = YDataRendering.Proportional.ResizeRule.FIXED;
    public get ATTR_Graph_resizeRule__DisplayName(): string {return "Font sizes"}
    public get ATTR_Graph_resizeRule__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_resizeRule__DescriptionAttribute(): string {return "Are font sizes fixed or do they change when window is resized?"}
    public get Graph_resizeRule(): YDataRendering.Proportional.ResizeRuleEnumItem { return this._Graph_resizeRule; }
    public set Graph_resizeRule(value: YDataRendering.Proportional.ResizeRuleEnumItem) { this._Graph_resizeRule = value; }

    private _Graph_xAxis: XaxisDescription = new XaxisDescription();
    public get ATTR_Graph_xAxis__DisplayName(): string {return "X Axis"}
    public get ATTR_Graph_xAxis__CategoryAttribute(): string {return "X/Y Axes"}
    public get ATTR_Graph_xAxis__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_xAxis__DescriptionAttribute(): string {return "X-Axis, expand for more"}
    public get Graph_xAxis(): XaxisDescription { return this._Graph_xAxis; }
    public set Graph_xAxis(value: XaxisDescription) { this._Graph_xAxis = value }

    private _Graph_yAxes0: YaxisDescription = new YaxisDescription(0, true);
    public get ATTR_Graph_yAxes0__DisplayName(): string {return "YAxis 1"}
    public get ATTR_Graph_yAxes0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_yAxes0__CategoryAttribute(): string {return "X/Y Axes"}
    public get ATTR_Graph_yAxes0__DescriptionAttribute(): string {return "First Y Axis, expand for more."}
    public get Graph_yAxes0(): YaxisDescription { return this._Graph_yAxes0; }
    public set Graph_yAxes0(value: YaxisDescription) { this._Graph_yAxes0 = value }

    private _Graph_yAxes1: YaxisDescription = new YaxisDescription(1, false);
    public get ATTR_Graph_yAxes1__DisplayName(): string {return "YAxis 2"}
    public get ATTR_Graph_yAxes1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_yAxes1__CategoryAttribute(): string {return "X/Y Axes"}
    public get ATTR_Graph_yAxes1__DescriptionAttribute(): string {return "Second Y Axis, expand for more."}
    public get Graph_yAxes1(): YaxisDescription { return this._Graph_yAxes1; }
    public set Graph_yAxes1(value: YaxisDescription) { this._Graph_yAxes1 = value }

    private _Graph_yAxes2: YaxisDescription = new YaxisDescription(2, false);
    public get ATTR_Graph_yAxes2__DisplayName(): string {return "YAxis 3"}
    public get ATTR_Graph_yAxes2__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_yAxes2__CategoryAttribute(): string {return "X/Y Axes"}
    public get ATTR_Graph_yAxes2__DescriptionAttribute(): string {return "Third Y Axis, expand for more."}
    public get Graph_yAxes2(): YaxisDescription { return this._Graph_yAxes2; }
    public set Graph_yAxes2(value: YaxisDescription) { this._Graph_yAxes2 = value }

    private _Graph_legendPanel: LegendPanelDescription = new LegendPanelDescription();
    public get ATTR_Graph_legendPanel__DisplayName(): string {return "Legend Panel"}
    public get ATTR_Graph_legendPanel__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_legendPanel__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_legendPanel__DescriptionAttribute(): string {return "Panel containing a description of all data series. Expand for more."}
    public get Graph_legendPanel(): LegendPanelDescription { return this._Graph_legendPanel; }
    public set Graph_legendPanel(value: LegendPanelDescription) { this._Graph_legendPanel = value; }

    private _Graph_dataTracker: DataTrackerDescription = new DataTrackerDescription();
    public get ATTR_Graph_dataTracker__DisplayName(): string {return "Data tracker"}
    public get ATTR_Graph_dataTracker__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_dataTracker__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_dataTracker__DescriptionAttribute(): string {return "Show dynamic value labels while the mouse is moving over the graph. Expand for more."}
    public get Graph_dataTracker(): DataTrackerDescription { return this._Graph_dataTracker; }
    public set Graph_dataTracker(value: DataTrackerDescription) { this._Graph_dataTracker = value; }

    private _Graph_navigator: NavigatorDescription = new NavigatorDescription();
    public get ATTR_Graph_navigator__DisplayName(): string {return "Navigator"}
    public get ATTR_Graph_navigator__CategoryAttribute(): string {return "Graph"}
    public get ATTR_Graph_navigator__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_navigator__DescriptionAttribute(): string {return "Small additional graph showing the whole data set and allowing to quickly navigate among data. Expand for more."}
    public get Graph_navigator(): NavigatorDescription { return this._Graph_navigator; }
    public set Graph_navigator(value: NavigatorDescription) { this._Graph_navigator = value; }

    private _annotationPanels0: AnnotationPanelDescription = new AnnotationPanelDescriptionGraph();
    public get ATTR_Graph_annotationPanels0__DisplayName(): string {return "Annotation 1"}
    public get ATTR_Graph_annotationPanels0__CategoryAttribute(): string {return "Annotations"}
    public get ATTR_Graph_annotationPanels0__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_annotationPanels0__DescriptionAttribute(): string {return "Customizable text panel 1"}
    public get Graph_annotationPanels0(): AnnotationPanelDescription { return this._annotationPanels0; }
    public set Graph_annotationPanels0(value: AnnotationPanelDescription) { this._annotationPanels0 = value; }

    private _annotationPanels1: AnnotationPanelDescription = new AnnotationPanelDescriptionGraph();
    public get ATTR_Graph_annotationPanels1__DisplayName(): string {return "Annotation 2"}
    public get ATTR_Graph_annotationPanels1__CategoryAttribute(): string {return "Annotations"}
    public get ATTR_Graph_annotationPanels1__ReadOnlyAttribute(): boolean {return true}
    public get ATTR_Graph_annotationPanels1__DescriptionAttribute(): string {return "Customizable text panel 2"}
    public get Graph_annotationPanels1(): AnnotationPanelDescription { return this._annotationPanels1; }
    public set Graph_annotationPanels1(value: AnnotationPanelDescription) { this._annotationPanels1 = value; }

} 
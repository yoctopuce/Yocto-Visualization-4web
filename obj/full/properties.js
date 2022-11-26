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
class GenericHints {
}
GenericHints.DevConfAffected = " Changing this value will affect the device configuration.";
GenericHints.CheckSensor = "If the sensor you want to use is connected, but not listed or listed as OFFLINE, check USB / Network configuration in the global configuration.";
GenericHints.AnnotationGraph = "Annotation text.  Use \\n for carriage returns. Some variables are available: $DAY$ $MONTH$ $YEAR$ for date, $HOUR$ $MINUTE$ $SECOND$ for time, $AVGVALUE1$ $MINVALUE1$ $MAXVALUE1$ $NAME1$ $UNIT1$  for first series data, $AVGVALUE2$ $MINVALUE2$ $MAXVALUE2$ $NAME2$ $UNIT2$  for second series data and so on";
GenericHints.Annotation = "Annotation text.  Use \\n for carriage returns. Some variables are available: $DAY$ $MONTH$ $YEAR$ for date, $HOUR$ $MINUTE$ $SECOND$ for time, $AVGVALUE$ $MINVALUE$ $MAXVALUE$ $NAME$ $UNIT$ for sensor related data.";
export class TypeDescription {
    static get AllowedValues() { return []; }
}
export class sensorFreqTypeDescription {
    static get AllowedValues() { return this._AllowedValues; }
}
sensorFreqTypeDescription._AllowedValues = ["25/s", "10/s", "5/s", "4/s", "3/s", "2/s", "1/s",
    "60/m", "30/m", "12/m", "6/m", "4/m", "3/m", "2/m", "1/m",
    "30/h", "12/h", "6/h", "4/h", "3/h", "2/h", "1/h"];
export class yAxisDescription {
    static initialize() {
        let yaxiscount = 0;
        let obj = new GraphFormProperties(null, null);
        let names = Object.getOwnPropertyNames(obj);
        names.forEach((name) => {
            if (name.startsWith("_Graph_yAxes"))
                yaxiscount++;
        });
        for (let i = 0; i < yaxiscount; i++) {
            switch (i) {
                case 0:
                    this._AllowedValues.push("1srt Y axis");
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
    static get AllowedValues() {
        if (!yAxisDescription.initialized)
            yAxisDescription.initialize();
        return this._AllowedValues;
    }
}
yAxisDescription._AllowedValues = [];
export class AlarmTestTypeDescription {
    static get AllowedValues() { return this._AllowedValues; }
}
AlarmTestTypeDescription._AllowedValues = ["Disabled", ">", ">=", "=", "<=", "<"];
export class fontNameTypeDescription {
    static fontNameTypeDescription() {
        // in C# this is used to detect available fonts.
    }
    static get AllowedValues() { return this._AllowedValues; }
}
fontNameTypeDescription._AllowedValues = ["Arial",
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
export class sensorPrecisionTypeDescription {
    static get AllowedValues() { return this._AllowedValues; }
}
sensorPrecisionTypeDescription._AllowedValues = ["0", "0.1", "0.12", "0.123"];
export class sensorDataTypeDescription {
    static get AllowedValues() { return this._AllowedValues; }
}
sensorDataTypeDescription._AllowedValues = ["Avg values", "Min values", "Max values"];
export class GaugeFormProperties extends YoctoVisualization.GenericProperties {
    constructor(initData, owner) {
        super(owner);
        this._DataSource_source = YoctoVisualization.sensorsManager.getNullSensor();
        this._DataSource_precision = "0.1";
        this._DataSource_AlarmSection0 = new AlarmSection(0);
        this._DataSource_AlarmSection1 = new AlarmSection(1);
        this._SolidGauge_min = 0;
        this._SolidGauge_max = 100;
        this._SolidGauge_showMinMax = true;
        this._SolidGauge_color1 = YDataRendering.YColor.LightGreen;
        this._SolidGauge_color2 = YDataRendering.YColor.Red;
        this._SolidGauge_font = new FontDescription("Arial", 20, YDataRendering.YColor.Black, false, true);
        this._SolidGauge_minMaxFont = new FontDescription("Arial", 10, YDataRendering.YColor.Black, false, true);
        this._SolidGauge_displayMode = YDataRendering.YSolidGauge.DisplayMode.DISPLAY90;
        this._SolidGauge_borderColor = YDataRendering.YColor.Black;
        this._SolidGauge_borderThickness = 2;
        this._SolidGauge_backgroundColor1 = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
        this._SolidGauge_backgroundColor2 = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
        this._SolidGauge_thickness = 25;
        this._SolidGauge_maxSpeed = 1;
        this._annotationPanels0 = new AnnotationPanelDescription(YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127), 10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
        this._annotationPanels1 = new AnnotationPanelDescription(YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127), 10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
        this.initFromXmlData(initData);
        this.PropagateDataSourceChange();
    }
    PropagateDataSourceChange() {
        this.ownerForm.SourceChanged(this._DataSource_source, 0);
        let props = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name;
        for (name in props) {
            if (name.startsWith("DataSource_AlarmSection")) {
                this[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }
    }
    get ATTR_DataSource_source__DisplayName() { return "Sensor"; }
    get ATTR_DataSource_source__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_source__ParamCategorySummaryAttribute() { return "sensorDescription"; }
    get ATTR_DataSource_source__PreExpandedCategoryAttribute() { return true; }
    get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_DataSource_source__DescriptionAttribute() { return "Yoctopuce sensor feeding the gauge. "; }
    get DataSource_source() { return this._DataSource_source; }
    set DataSource_source(value) {
        let prev = this._DataSource_source;
        this._DataSource_source = value;
        this.PropagateDataSourceChange();
        //#ifndef READONLY
        if (this._DataSource_source != prev)
            YoctoVisualization.constants.edited = true;
        //#endif
    }
    get sensorDescription() {
        return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
    }
    get isSensorReadOnly() { return this._DataSource_source.isReadOnly; }
    get ATTR_DataSource_freq__DisplayName() { return "Sensor freq"; }
    get ATTR_DataSource_freq__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_freq__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_freq__IsReadonlyCallAttribute() { return this.isSensorReadOnly; }
    get ATTR_DataSource_freq__AllowedValues() { return sensorFreqTypeDescription.AllowedValues; }
    get ATTR_DataSource_freq__DescriptionAttribute() { return "Sensor data acquisition frequency." + GenericHints.DevConfAffected; }
    get DataSource_freq() { return this._DataSource_source.get_frequency(); }
    set DataSource_freq(value) { this._DataSource_source.set_frequency(value); }
    get ATTR_DataSource_precision__DisplayName() { return "Precision"; }
    get ATTR_DataSource_precision__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_precision__DescriptionAttribute() { return "How many digits shown after the decimal point"; }
    get ATTR_DataSource_precision__AllowedValues() { return sensorPrecisionTypeDescription.AllowedValues; }
    get DataSource_precision() { return this._DataSource_precision; }
    set DataSource_precision(value) { this._DataSource_precision = value; }
    get ATTR_DataSource_AlarmSection0__DisplayName() { return "Sensor value alarm 1"; }
    get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_AlarmSection0__DescriptionAttribute() { return "Alarm 1 for this data source, expand for more."; }
    get DataSource_AlarmSection0() { return this._DataSource_AlarmSection0; }
    set DataSource_AlarmSection0(value) { this._DataSource_AlarmSection0 = value; }
    get ATTR_DataSource_AlarmSection1__DisplayName() { return "Sensor value alarm 2"; }
    get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_AlarmSection1__DescriptionAttribute() { return "Alarm 2 for this data source, expand for more."; }
    get DataSource_AlarmSection1() { return this._DataSource_AlarmSection1; }
    set DataSource_AlarmSection1(value) { this._DataSource_AlarmSection1 = value; }
    get ATTR_SolidGauge_min__DisplayName() { return "Minimum value"; }
    get ATTR_SolidGauge_min__CategoryAttribute() { return "Values range"; }
    get ATTR_SolidGauge_min__DescriptionAttribute() { return "Minimum value displayable by the gauge."; }
    get SolidGauge_min() { return this._SolidGauge_min; }
    set SolidGauge_min(value) { this._SolidGauge_min = value; }
    get ATTR_SolidGauge_max__DisplayName() { return "Maximum value"; }
    get ATTR_SolidGauge_max__CategoryAttribute() { return "Values range"; }
    get ATTR_SolidGauge_max__DescriptionAttribute() { return "Maximum value displayable by the gauge."; }
    get SolidGauge_max() { return this._SolidGauge_max; }
    set SolidGauge_max(value) { this._SolidGauge_max = value; }
    get ATTR_SolidGauge_showMinMax__DisplayName() { return "show  min/max"; }
    get ATTR_SolidGauge_showMinMax__CategoryAttribute() { return "Values range"; }
    get ATTR_SolidGauge_showMinMax__DescriptionAttribute() { return "Show the min / max values."; }
    get SolidGauge_showMinMax() { return this._SolidGauge_showMinMax; }
    set SolidGauge_showMinMax(value) { this._SolidGauge_showMinMax = value; }
    get ATTR_SolidGauge_color1__DisplayName() { return "Min Color"; }
    get ATTR_SolidGauge_color1__CategoryAttribute() { return "Values range"; }
    get ATTR_SolidGauge_color1__DescriptionAttribute() { return "Color for minimum value."; }
    get SolidGauge_color1() { return this._SolidGauge_color1; }
    set SolidGauge_color1(value) { this._SolidGauge_color1 = value; }
    get ATTR_SolidGauge_color2__DisplayName() { return "Max Color"; }
    get ATTR_SolidGauge_color2__CategoryAttribute() { return "Values range"; }
    get ATTR_SolidGauge_color2__DescriptionAttribute() { return "Color for maximum value."; }
    get SolidGauge_color2() { return this._SolidGauge_color2; }
    set SolidGauge_color2(value) { this._SolidGauge_color2 = value; }
    get ATTR_SolidGauge_font__DisplayName() { return "Unit  Font"; }
    get ATTR_SolidGauge_font__CategoryAttribute() { return "Fonts"; }
    get ATTR_SolidGauge_font__ReadOnlyAttribute() { return true; }
    get ATTR_SolidGauge_font__DescriptionAttribute() { return "Font for displaying the value/status indicator"; }
    get SolidGauge_font() { return this._SolidGauge_font; }
    set SolidGauge_font(value) { this._SolidGauge_font = value; }
    get ATTR_SolidGauge_minMaxFont__DisplayName() { return "Min Max  Font"; }
    get ATTR_SolidGauge_minMaxFont__CategoryAttribute() { return "Fonts"; }
    get ATTR_SolidGauge_minMaxFont__ReadOnlyAttribute() { return true; }
    get ATTR_SolidGauge_minMaxFont__DescriptionAttribute() { return "Font for displaying min/max values"; }
    get SolidGauge_minMaxFont() { return this._SolidGauge_minMaxFont; }
    set SolidGauge_minMaxFont(value) { this._SolidGauge_minMaxFont = value; }
    get ATTR_SolidGauge_displayMode__DisplayName() { return "Display mode"; }
    get ATTR_SolidGauge_displayMode__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_displayMode__DescriptionAttribute() { return "Dial general shape"; }
    get SolidGauge_displayMode() { return this._SolidGauge_displayMode; }
    set SolidGauge_displayMode(value) { this._SolidGauge_displayMode = value; }
    get ATTR_SolidGauge_borderColor__DisplayName() { return "Border color"; }
    get ATTR_SolidGauge_borderColor__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_borderColor__DescriptionAttribute() { return "Dial border color."; }
    get SolidGauge_borderColor() { return this._SolidGauge_borderColor; }
    set SolidGauge_borderColor(value) { this._SolidGauge_borderColor = value; }
    get ATTR_SolidGauge_borderThickness__DisplayName() { return "Border thickness "; }
    get ATTR_SolidGauge_borderThickness__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_borderThickness__DescriptionAttribute() { return "Thickness of the dial border"; }
    get SolidGauge_borderThickness() { return this._SolidGauge_borderThickness; }
    set SolidGauge_borderThickness(value) { this._SolidGauge_borderThickness = value; }
    get ATTR_SolidGauge_backgroundColor1__DisplayName() { return "Background color 1"; }
    get ATTR_SolidGauge_backgroundColor1__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_backgroundColor1__DescriptionAttribute() { return "Dial background gradient color 1."; }
    get SolidGauge_backgroundColor1() { return this._SolidGauge_backgroundColor1; }
    set SolidGauge_backgroundColor1(value) { this._SolidGauge_backgroundColor1 = value; }
    get ATTR_SolidGauge_backgroundColor2__DisplayName() { return "Background color 2"; }
    get ATTR_SolidGauge_backgroundColor2__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_backgroundColor2__DescriptionAttribute() { return "Dial background gradient color 2."; }
    get SolidGauge_backgroundColor2() { return this._SolidGauge_backgroundColor2; }
    set SolidGauge_backgroundColor2(value) { this._SolidGauge_backgroundColor2 = value; }
    get ATTR_SolidGauge_thickness__DisplayName() { return "Dial thickness (%) "; }
    get ATTR_SolidGauge_thickness__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_thickness__DescriptionAttribute() { return "Thickness of the dial, in percentage relative to radius"; }
    get SolidGauge_thickness() { return this._SolidGauge_thickness; }
    set SolidGauge_thickness(value) { this._SolidGauge_thickness = value; }
    get ATTR_SolidGauge_maxSpeed__DisplayName() { return "Max speed (%) "; }
    get ATTR_SolidGauge_maxSpeed__CategoryAttribute() { return "Dial"; }
    get ATTR_SolidGauge_maxSpeed__DescriptionAttribute() { return "Maximum speed of the dial in percentage relative to Max-Min. This is meant to limit \"teleporting\" effects."; }
    get SolidGauge_maxSpeed() { return this._SolidGauge_maxSpeed; }
    set SolidGauge_maxSpeed(value) { this._SolidGauge_maxSpeed = value; }
    IsDataSourceAssigned() {
        return !(this._DataSource_source instanceof YoctoVisualization.NullYSensor);
    }
    get ATTR_SolidGauge_annotationPanels0__DisplayName() { return "Annotation 1"; }
    get ATTR_SolidGauge_annotationPanels0__CategoryAttribute() { return "Annotations"; }
    get ATTR_SolidGauge_annotationPanels0__ReadOnlyAttribute() { return true; }
    get ATTR_SolidGauge_annotationPanels0__DescriptionAttribute() { return "Customizable text panels"; }
    get SolidGauge_annotationPanels0() { return this._annotationPanels0; }
    set SolidGauge_annotationPanels0(value) { this._annotationPanels0 = value; }
    get ATTR_SolidGauge_annotationPanels1__DisplayName() { return "Annotation 2"; }
    get ATTR_SolidGauge_annotationPanels1__CategoryAttribute() { return "Annotations"; }
    get ATTR_SolidGauge_annotationPanels1__ReadOnlyAttribute() { return true; }
    get ATTR_SolidGauge_annotationPanels1__DescriptionAttribute() { return "Customizable text panels"; }
    get SolidGauge_annotationPanels1() { return this._annotationPanels1; }
    set SolidGauge_annotationPanels1(value) { this._annotationPanels1 = value; }
}
//****************************
//  angular gauge
//****************************
export class AngularGaugeFormProperties extends YoctoVisualization.GenericProperties {
    constructor(initData, owner) {
        super(owner);
        this._DataSource_source = YoctoVisualization.sensorsManager.getNullSensor();
        this._DataSource_AlarmSection0 = new AlarmSection(0);
        this._DataSource_AlarmSection1 = new AlarmSection(1);
        this._AngularGauge_min = 0;
        this._AngularGauge_max = 100;
        this._AngularGauge_unitFactor = 1;
        this._AngularGauge_graduation = 10;
        this._AngularGauge_graduationSize = 10;
        this._AngularGauge_graduationOuterRadiusSize = 98;
        this._AngularGauge_graduationThickness = 2;
        this._AngularGauge_graduationColor = YDataRendering.YColor.Black;
        this._AngularGauge_graduationFont = new FontDescription("Arial", 20, YDataRendering.YColor.Black, false, true);
        this._AngularGauge_subgraduationCount = 5;
        this._AngularGauge_subgraduationSize = 5;
        this._AngularGauge_subgraduationThickness = 1;
        this._AngularGauge_subgraduationColor = YDataRendering.YColor.Black;
        this._AngularGauge_needleColor = YDataRendering.YColor.Red;
        this._AngularGauge_needleContourColor = YDataRendering.YColor.DarkRed;
        this._AngularGauge_needleContourThickness = 1;
        this._AngularGauge_needleLength1 = 90;
        this._AngularGauge_needleLength2 = 15;
        this._AngularGauge_needleWidth = 5;
        this._AngularGauge_needleMaxSpeed = 0.5;
        this._AngularGauge_unitFont = new FontDescription("Arial", 24, YDataRendering.YColor.DarkGray, false, true);
        this._AngularGauge_statusFont = new FontDescription("Arial", 24, YDataRendering.YColor.DarkGray, false, true);
        this._AngularGauge_borderColor = YDataRendering.YColor.Black;
        this._AngularGauge_borderThickness = 5;
        this._AngularGauge_backgroundColor1 = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
        this._AngularGauge_backgroundColor2 = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
        this._AngularGauge_zones0 = new AngularZoneDescription(0, 50, YDataRendering.YColor.LightGreen);
        this._AngularGauge_zones1 = new AngularZoneDescription(0, 50, YDataRendering.YColor.Yellow);
        this._AngularGauge_zones2 = new AngularZoneDescription(0, 50, YDataRendering.YColor.Red);
        this._annotationPanels0 = new AnnotationPanelDescription(YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.CENTER, 0, false, "$NAME$", YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127), 10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
        this._annotationPanels1 = new AnnotationPanelDescription(YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127), 10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
        this.initFromXmlData(initData);
        this.PropagateDataSourceChange();
    }
    PropagateDataSourceChange() {
        this.ownerForm.SourceChanged(this._DataSource_source, 0);
        let props = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name;
        for (name in props) {
            if (name.startsWith("DataSource_AlarmSection")) {
                this[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }
    }
    IsDataSourceAssigned() {
        return !(this._DataSource_source instanceof YoctoVisualization.NullYSensor);
    }
    get ATTR_DataSource_source__DisplayName() { return "Sensor"; }
    get ATTR_DataSource_source__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_source__ParamCategorySummaryAttribute() { return "sensorDescription"; }
    get ATTR_DataSource_source__PreExpandedCategoryAttribute() { return true; }
    get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_DataSource_source__DescriptionAttribute() { return "Yoctopuce sensor feeding the gauge. " + GenericHints.CheckSensor; }
    get DataSource_source() { return this._DataSource_source; }
    set DataSource_source(value) {
        let prev = this._DataSource_source;
        this._DataSource_source = value;
        this.PropagateDataSourceChange();
        //#ifndef READONLY
        if (this._DataSource_source != prev)
            YoctoVisualization.constants.edited = true;
        //#endif
    }
    get sensorDescription() {
        return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
    }
    get isSensorReadOnly() { return this._DataSource_source.isReadOnly; }
    get ATTR_DataSource_freq__DisplayName() { return "Sensor freq"; }
    get ATTR_DataSource_freq__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_freq__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_freq__IsReadonlyCallAttribute() { return "isSensorReadOnly"; }
    get ATTR_DataSource_freq__DescriptionAttribute() { return "Sensor data acquisition frequency." + GenericHints.DevConfAffected; }
    get ATTR_DataSource_freq__AllowedValues() { return sensorFreqTypeDescription.AllowedValues; }
    get DataSource_freq() { return this._DataSource_source.get_frequency(); }
    set DataSource_freq(value) { this._DataSource_source.set_frequency(value); }
    get ATTR_DataSource_AlarmSection0__DisplayName() { return "Sensor value alarm 1"; }
    get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_AlarmSection0__DescriptionAttribute() { return "Alarm 1 for this data source, expand for more."; }
    get DataSource_AlarmSection0() { return this._DataSource_AlarmSection0; }
    set DataSource_AlarmSection0(value) { this._DataSource_AlarmSection0 = value; }
    get ATTR_DataSource_AlarmSection1__DisplayName() { return "Sensor value alarm 2"; }
    get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_AlarmSection1__DescriptionAttribute() { return "Alarm 2 for this data source, expand for more."; }
    get DataSource_AlarmSection1() { return this._DataSource_AlarmSection1; }
    set DataSource_AlarmSection1(value) { this._DataSource_AlarmSection1 = value; }
    get ATTR_AngularGauge_min__DisplayName() { return "Minimum value"; }
    get ATTR_AngularGauge_min__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_min__DescriptionAttribute() { return "Minimum value displayable by the gauge."; }
    get AngularGauge_min() { return this._AngularGauge_min; }
    set AngularGauge_min(value) { this._AngularGauge_min = value; }
    get ATTR_AngularGauge_max__DisplayName() { return "Maximum value"; }
    get ATTR_AngularGauge_max__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_max__DescriptionAttribute() { return "Maximum value displayable by the gauge."; }
    get AngularGauge_max() { return this._AngularGauge_max; }
    set AngularGauge_max(value) { this._AngularGauge_max = value; }
    get ATTR_AngularGauge_unitFactor__DisplayName() { return "Unit factor"; }
    get ATTR_AngularGauge_unitFactor__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_unitFactor__DescriptionAttribute() { return "Data  will be divided by this value before being displayed, this allows simpler gradation marks."; }
    get AngularGauge_unitFactor() { return this._AngularGauge_unitFactor; }
    set AngularGauge_unitFactor(value) { this._AngularGauge_unitFactor = value; }
    get ATTR_AngularGauge_graduation__DisplayName() { return "Main gradation steps"; }
    get ATTR_AngularGauge_graduation__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_graduation__DescriptionAttribute() { return "Difference between two consecutive main gradation marks"; }
    get AngularGauge_graduation() { return this._AngularGauge_graduation; }
    set AngularGauge_graduation(value) { this._AngularGauge_graduation = value; }
    get ATTR_AngularGauge_graduationSize__DisplayName() { return "Main gradation size (%)"; }
    get ATTR_AngularGauge_graduationSize__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_graduationSize__DescriptionAttribute() { return "Main gradation marks size in percent, relative to dial radius"; }
    get AngularGauge_graduationSize() { return this._AngularGauge_graduationSize; }
    set AngularGauge_graduationSize(value) { this._AngularGauge_graduationSize = value; }
    get ATTR_AngularGauge_graduationOuterRadiusSize__DisplayName() { return "Main gradation radius (%)"; }
    get ATTR_AngularGauge_graduationOuterRadiusSize__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_graduationOuterRadiusSize__DescriptionAttribute() { return "Main gradation marks outer radius in percent, relative to dial radius"; }
    get AngularGauge_graduationOuterRadiusSize() { return this._AngularGauge_graduationOuterRadiusSize; }
    set AngularGauge_graduationOuterRadiusSize(value) { this._AngularGauge_graduationOuterRadiusSize = value; }
    get ATTR_AngularGauge_graduationThickness__DisplayName() { return "Main gradation thickness"; }
    get ATTR_AngularGauge_graduationThickness__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_graduationThickness__DescriptionAttribute() { return "Main gradation marks thickness"; }
    get AngularGauge_graduationThickness() { return this._AngularGauge_graduationThickness; }
    set AngularGauge_graduationThickness(value) { this._AngularGauge_graduationThickness = value; }
    get ATTR_AngularGauge_graduationColor__DisplayName() { return "Main gradation color"; }
    get ATTR_AngularGauge_graduationColor__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_graduationColor__DescriptionAttribute() { return "Main gradation marks color."; }
    get AngularGauge_graduationColor() { return this._AngularGauge_graduationColor; }
    set AngularGauge_graduationColor(value) { this._AngularGauge_graduationColor = value; }
    get ATTR_AngularGauge_graduationFont__DisplayName() { return "Main gradation font"; }
    get ATTR_AngularGauge_graduationFont__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_graduationFont__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_graduationFont__DescriptionAttribute() { return "Font used for gradation labels"; }
    get AngularGauge_graduationFont() { return this._AngularGauge_graduationFont; }
    set AngularGauge_graduationFont(value) { this._AngularGauge_graduationFont = value; }
    get ATTR_AngularGauge_subgraduationCount__DisplayName() { return "Sub-gradation count"; }
    get ATTR_AngularGauge_subgraduationCount__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_subgraduationCount__DescriptionAttribute() { return "How many sub-gradation (+1) marks between two consecutive main graduation marks"; }
    get AngularGauge_subgraduationCount() { return this._AngularGauge_subgraduationCount; }
    set AngularGauge_subgraduationCount(value) { this._AngularGauge_subgraduationCount = value; }
    get ATTR_AngularGauge_subgraduationSize__DisplayName() { return "Sub-gradation size (%)"; }
    get ATTR_AngularGauge_subgraduationSize__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_subgraduationSize__DescriptionAttribute() { return "Sub-gradation marks size in percent, relative to dial radius"; }
    get AngularGauge_subgraduationSize() { return this._AngularGauge_subgraduationSize; }
    set AngularGauge_subgraduationSize(value) { this._AngularGauge_subgraduationSize = value; }
    get ATTR_AngularGauge_subgraduationThickness__DisplayName() { return "Sub-gradation thickness"; }
    get ATTR_AngularGauge_subgraduationThickness__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_subgraduationThickness__DescriptionAttribute() { return "Sub-gradation marks thickness"; }
    get AngularGauge_subgraduationThickness() { return this._AngularGauge_subgraduationThickness; }
    set AngularGauge_subgraduationThickness(value) { this._AngularGauge_subgraduationThickness = value; }
    get ATTR_AngularGauge_subgraduationColor__DisplayName() { return "Sub-gradation color"; }
    get ATTR_AngularGauge_subgraduationColor__CategoryAttribute() { return "Gauge gradations"; }
    get ATTR_AngularGauge_subgraduationColor__DescriptionAttribute() { return "Sub-gradation marks color."; }
    get AngularGauge_subgraduationColor() { return this._AngularGauge_subgraduationColor; }
    set AngularGauge_subgraduationColor(value) { this._AngularGauge_subgraduationColor = value; }
    get ATTR_AngularGauge_needleColor__DisplayName() { return "Needle color"; }
    get ATTR_AngularGauge_needleColor__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleColor__DescriptionAttribute() { return "Needle filling color."; }
    get AngularGauge_needleColor() { return this._AngularGauge_needleColor; }
    set AngularGauge_needleColor(value) { this._AngularGauge_needleColor = value; }
    get ATTR_AngularGauge_needleContourColor__DisplayName() { return "Needle contour color"; }
    get ATTR_AngularGauge_needleContourColor__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleContourColor__DescriptionAttribute() { return "Needle contour color."; }
    get AngularGauge_needleContourColor() { return this._AngularGauge_needleContourColor; }
    set AngularGauge_needleContourColor(value) { this._AngularGauge_needleContourColor = value; }
    get ATTR_AngularGauge_needleContourThickness__DisplayName() { return "Needle contour thickness"; }
    get ATTR_AngularGauge_needleContourThickness__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleContourThickness__DescriptionAttribute() { return "Thickness of the needle contour"; }
    get AngularGauge_needleContourThickness() { return this._AngularGauge_needleContourThickness; }
    set AngularGauge_needleContourThickness(value) { this._AngularGauge_needleContourThickness = value; }
    get ATTR_AngularGauge_needleLength1__DisplayName() { return "Needle main size (%)"; }
    get ATTR_AngularGauge_needleLength1__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleLength1__DescriptionAttribute() { return "Length of the needle part pointing to gradations, in % relative to radius"; }
    get AngularGauge_needleLength1() { return this._AngularGauge_needleLength1; }
    set AngularGauge_needleLength1(value) { this._AngularGauge_needleLength1 = value; }
    get ATTR_AngularGauge_needleLength2__DisplayName() { return "Needle foot size (%)"; }
    get ATTR_AngularGauge_needleLength2__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleLength2__DescriptionAttribute() { return "Length of the needle part not pointing to gradations, in % relative to radius"; }
    get AngularGauge_needleLength2() { return this._AngularGauge_needleLength2; }
    set AngularGauge_needleLength2(value) { this._AngularGauge_needleLength2 = value; }
    get ATTR_AngularGauge_needleWidth__DisplayName() { return "Needle width (%)"; }
    get ATTR_AngularGauge_needleWidth__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleWidth__DescriptionAttribute() { return "Width of the needle, in % relative to radius"; }
    get AngularGauge_needleWidth() { return this._AngularGauge_needleWidth; }
    set AngularGauge_needleWidth(value) { this._AngularGauge_needleWidth = value; }
    get ATTR_AngularGauge_needleMaxSpeed__DisplayName() { return "Needle max speed (%)"; }
    get ATTR_AngularGauge_needleMaxSpeed__CategoryAttribute() { return "Needle"; }
    get ATTR_AngularGauge_needleMaxSpeed__DescriptionAttribute() { return "Needle Maximum speed, in % relative to (max-min). This is meant to limit \"teleporting\" effects."; }
    get AngularGauge_needleMaxSpeed() { return this._AngularGauge_needleMaxSpeed; }
    set AngularGauge_needleMaxSpeed(value) { this._AngularGauge_needleMaxSpeed = value; }
    get ATTR_AngularGauge_unitFont__DisplayName() { return "Unit Line Font"; }
    get ATTR_AngularGauge_unitFont__CategoryAttribute() { return "Text lines"; }
    get ATTR_AngularGauge_unitFont__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_unitFont__DescriptionAttribute() { return "Font used in the text line describing unit"; }
    get AngularGauge_unitFont() { return this._AngularGauge_unitFont; }
    set AngularGauge_unitFont(value) { this._AngularGauge_unitFont = value; }
    get ATTR_AngularGauge_statusFont__DisplayName() { return "Status Line Font"; }
    get ATTR_AngularGauge_statusFont__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_statusFont__CategoryAttribute() { return "Text lines"; }
    get ATTR_AngularGauge_statusFont__DescriptionAttribute() { return "Font used in the text line gauge status"; }
    get AngularGauge_statusFont() { return this._AngularGauge_statusFont; }
    set AngularGauge_statusFont(value) { this._AngularGauge_statusFont = value; }
    get ATTR_AngularGauge_borderColor__DisplayName() { return "Border color"; }
    get ATTR_AngularGauge_borderColor__CategoryAttribute() { return "Dial"; }
    get ATTR_AngularGauge_borderColor__DescriptionAttribute() { return "Dial border color."; }
    get AngularGauge_borderColor() { return this._AngularGauge_borderColor; }
    set AngularGauge_borderColor(value) { this._AngularGauge_borderColor = value; }
    get ATTR_AngularGauge_borderThickness__DisplayName() { return "Border thickness "; }
    get ATTR_AngularGauge_borderThickness__CategoryAttribute() { return "Dial"; }
    get ATTR_AngularGauge_borderThickness__DescriptionAttribute() { return "Thickness of the dial border"; }
    get AngularGauge_borderThickness() { return this._AngularGauge_borderThickness; }
    set AngularGauge_borderThickness(value) { this._AngularGauge_borderThickness = value; }
    get ATTR_AngularGauge_backgroundColor1__DisplayName() { return "Background color 1"; }
    get ATTR_AngularGauge_backgroundColor1__CategoryAttribute() { return "Dial"; }
    get ATTR_AngularGauge_backgroundColor1__DescriptionAttribute() { return "Dial background gradient color 1."; }
    get AngularGauge_backgroundColor1() { return this._AngularGauge_backgroundColor1; }
    set AngularGauge_backgroundColor1(value) { this._AngularGauge_backgroundColor1 = value; }
    get ATTR_AngularGauge_backgroundColor2__DisplayName() { return "Background color 2"; }
    get ATTR_AngularGauge_backgroundColor2__CategoryAttribute() { return "Dial"; }
    get ATTR_AngularGauge_backgroundColor2__DescriptionAttribute() { return "Dial background gradient color 2."; }
    get AngularGauge_backgroundColor2() { return this._AngularGauge_backgroundColor2; }
    set AngularGauge_backgroundColor2(value) { this._AngularGauge_backgroundColor2 = value; }
    get ATTR_AngularGauge_zones0__DisplayName() { return "Zone 1"; }
    get ATTR_AngularGauge_zones0__CategoryAttribute() { return "Zones"; }
    get ATTR_AngularGauge_zones0__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_zones0__DescriptionAttribute() { return "Zone 1 parameters"; }
    get AngularGauge_zones0() { return this._AngularGauge_zones0; }
    set AngularGauge_zones0(value) { this._AngularGauge_zones0 = value; }
    get ATTR_AngularGauge_zones1__DisplayName() { return "Zone 2"; }
    get ATTR_AngularGauge_zones1__CategoryAttribute() { return "Zones"; }
    get ATTR_AngularGauge_zones1__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_zones1__DescriptionAttribute() { return "Zone 2 parameters"; }
    get AngularGauge_zones1() { return this._AngularGauge_zones1; }
    set AngularGauge_zones1(value) { this._AngularGauge_zones1 = value; }
    get ATTR_AngularGauge_zones2__DisplayName() { return "Zone 2"; }
    get ATTR_AngularGauge_zones2__CategoryAttribute() { return "Zones"; }
    get ATTR_AngularGauge_zones2__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_zones2__DescriptionAttribute() { return "Zone 2 parameters"; }
    get AngularGauge_zones2() { return this._AngularGauge_zones2; }
    set AngularGauge_zones2(value) { this._AngularGauge_zones2 = value; }
    get ATTR_AngularGauge_annotationPanels0__DisplayName() { return "Annotation 1"; }
    get ATTR_AngularGauge_annotationPanels0__CategoryAttribute() { return "Annotations"; }
    get ATTR_AngularGauge_annotationPanels0__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_annotationPanels0__DescriptionAttribute() { return "Customizable text panels"; }
    get AngularGauge_annotationPanels0() { return this._annotationPanels0; }
    set AngularGauge_annotationPanels0(value) { this._annotationPanels0 = value; }
    get ATTR_AngularGauge_annotationPanels1__DisplayName() { return "Annotation 2"; }
    get ATTR_AngularGauge_annotationPanels1__CategoryAttribute() { return "Annotations"; }
    get ATTR_AngularGauge_annotationPanels1__ReadOnlyAttribute() { return true; }
    get ATTR_AngularGauge_annotationPanels1__DescriptionAttribute() { return "Customizable text panels"; }
    get AngularGauge_annotationPanels1() { return this._annotationPanels1; }
    set AngularGauge_annotationPanels1(value) { this._annotationPanels1 = value; }
}
export class ZoneDescription {
    constructor(min, max, color) {
        this._visible = false;
        this._min = min;
        this._max = max;
        this._color = color;
    }
    get summary() { return this._visible ? this._min.toString() + ".." + this._max.toString() : "Disabled"; }
    get ATTR_visible__DisplayName() { return "Visible"; }
    get ATTR_visible__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_visible__DescriptionAttribute() { return "Zone visibility."; }
    get visible() { return this._visible; }
    set visible(value) { this._visible = value; }
    get ATTR_min__DisplayName() { return "Minimum value"; }
    get ATTR_min__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_min__DescriptionAttribute() { return "Zone minimum value"; }
    get min() { return this._min; }
    set min(value) { this._min = value; }
    get ATTR_max__DisplayName() { return "Maximum value"; }
    get ATTR_max__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_max__DescriptionAttribute() { return "Zone maximum value"; }
    get max() { return this._max; }
    set max(value) { this._max = value; }
    get ATTR_color__DisplayName() { return "Color"; }
    get ATTR_color__DescriptionAttribute() { return "Zone color"; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
}
export class AngularZoneDescription {
    constructor(min, max, color) {
        this._width = 5;
        this._outerRadius = 98;
        this._visible = false;
        this._min = min;
        this._max = max;
        this._color = color;
    }
    get summary() { return this._visible ? this._min.toString() + ".." + this._max.toString() : "Disabled"; }
    get ATTR_visible__DisplayName() { return "Visible"; }
    get ATTR_visible__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_visible__DescriptionAttribute() { return "Zone visibility."; }
    get visible() { return this._visible; }
    set visible(value) { this._visible = value; }
    get ATTR_min__DisplayName() { return "Minimum value"; }
    get ATTR_min__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_min__DescriptionAttribute() { return "Zone minimum value"; }
    get min() { return this._min; }
    set min(value) { this._min = value; }
    get ATTR_max__DisplayName() { return "Maximum value"; }
    get ATTR_max__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_max__DescriptionAttribute() { return "Zone maximum value"; }
    get max() { return this._max; }
    set max(value) { this._max = value; }
    get ATTR_color__DisplayName() { return "Color"; }
    get ATTR_color__DescriptionAttribute() { return "Zone color"; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
    get ATTR_outerRadius__DisplayName() { return "Outer radius (%)"; }
    get ATTR_outerRadius__DescriptionAttribute() { return "Zone outer radius, in percentage relative to dial radius "; }
    get outerRadius() { return this._outerRadius; }
    set outerRadius(value) { this._outerRadius = value; }
    get ATTR_width__DisplayName() { return "Width (%)"; }
    get ATTR_width__DescriptionAttribute() { return "Zone  width, in percentage relative to dial radius "; }
    get width() { return this._width; }
    set width(value) { this._width = value; }
}
//****************************
//  Fonts
//****************************
export class FontDescription {
    constructor(name, size, color, italic, bold) {
        this._name = name;
        this._size = size;
        this._color = color;
        this._italic = italic;
        this._bold = bold;
    }
    ToString() { return this._name + " " + this._size.toString(); }
    get summary() { return this._name + " " + this._size.toString(); }
    get ATTR_name__DisplayName() { return "Font name"; }
    get ATTR_name__AllowedValues() { return fontNameTypeDescription.AllowedValues; }
    get ATTR_name__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_name__DescriptionAttribute() { return "Name of the font"; }
    get name() { return this._name; }
    set name(value) { this._name = value; }
    get ATTR_size__DisplayName() { return "Font size"; }
    get ATTR_size__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_size__DescriptionAttribute() { return "Size of the font"; }
    get size() { return this._size; }
    set size(value) { this._size = (Math.round(100 * value) / 100); }
    get ATTR_color__DisplayName() { return "Font color"; }
    get ATTR_color__DescriptionAttribute() { return "Color of the font."; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
    get ATTR_italic__DisplayName() { return "Italic"; }
    get ATTR_italic__DescriptionAttribute() { return "Is the font style italic?."; }
    get italic() { return this._italic; }
    set italic(value) { this._italic = value; }
    get ATTR_bold__DisplayName() { return "Bold"; }
    get ATTR_bold__DescriptionAttribute() { return "Is the font style bold?."; }
    get bold() { return this._bold; }
    set bold(value) { this._bold = value; }
}
//****************************
//  Digital display
//****************************
export class digitalDisplayFormProperties extends YoctoVisualization.GenericProperties {
    constructor(initData, owner) {
        super(owner);
        this._DataSource_source = YoctoVisualization.sensorsManager.getNullSensor();
        this._DataSource_precision = "0.1";
        this._DataSource_AlarmSection0 = new AlarmSection(0);
        this._DataSource_AlarmSection1 = new AlarmSection(1);
        this._font = new FontDescription("Arial", 48, YDataRendering.YColor.LightGreen, false, true);
        this._display_backgroundColor1 = YDataRendering.YColor.Black;
        this._display_backgroundColor2 = YDataRendering.YColor.Black;
        this._hrzAlignment = YDataRendering.YDigitalDisplay.HrzAlignment.RIGHT;
        this._hrzAlignmentOfset = 5.0;
        this._outOfRangeMin = new YoctoVisualization.doubleNan(Number.NaN);
        this._outOfRangeMax = new YoctoVisualization.doubleNan(Number.NaN);
        this._outOfRangeColor = YDataRendering.YColor.Red;
        this._annotationPanels0 = new AnnotationPanelDescription(YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.CENTER, 0, false, "$NAME$", YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127), 10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
        this._annotationPanels1 = new AnnotationPanelDescription(YDataRendering.GenericPanel.HorizontalAlignPos.CENTER, YDataRendering.GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YDataRendering.YColor.FromArgb(0, 127, 127, 127), YDataRendering.YColor.FromArgb(0, 127, 127, 127), 10.0, YDataRendering.YColor.FromArgb(255, 0, 0, 0));
        this.initFromXmlData(initData);
        this.PropagateDataSourceChange();
    }
    PropagateDataSourceChange() {
        this.ownerForm.SourceChanged(this._DataSource_source, 0);
        let props = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name;
        for (name in props) {
            if (name.startsWith("DataSource_AlarmSection")) {
                this[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }
    }
    IsDataSourceAssigned() {
        return !(this._DataSource_source instanceof YoctoVisualization.NullYSensor);
    }
    get ATTR_DataSource_source__DisplayName() { return "Sensor"; }
    get ATTR_DataSource_source__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_source__ParamCategorySummaryAttribute() { return "sensorDescription"; }
    get ATTR_DataSource_source__PreExpandedCategoryAttribute() { return true; }
    get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_DataSource_source__DescriptionAttribute() { return "Yoctopuce sensor feeding the display. " + GenericHints.CheckSensor; }
    get DataSource_source() { return this._DataSource_source; }
    set DataSource_source(value) {
        let prev = this._DataSource_source;
        this._DataSource_source = value;
        this.PropagateDataSourceChange();
        //#ifndef READONLY
        if (this._DataSource_source != prev)
            YoctoVisualization.constants.edited = true;
        //#endif
    }
    get isSensorReadOnly() { return this._DataSource_source.isReadOnly; }
    get sensorDescription() {
        return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
    }
    get ATTR_DataSource_freq__DisplayName() { return "Sensor freq"; }
    get ATTR_DataSource_freq__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_freq__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_freq__IsReadonlyCallAttribute() { return "isSensorReadOnly"; }
    get ATTR_DataSource_freq__DescriptionAttribute() { return "Sensor data acquisition frequency." + GenericHints.DevConfAffected; }
    get ATTR_DataSource_freq__AllowedValues() { return sensorFreqTypeDescription.AllowedValues; }
    get DataSource_freq() { return this._DataSource_source.get_frequency(); }
    set DataSource_freq(value) { this._DataSource_source.set_frequency(value); }
    get ATTR_DataSource_precision__DisplayName() { return "Precision"; }
    get ATTR_DataSource_precision__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_precision__DescriptionAttribute() { return "How many digits shown after the decimal point."; }
    get ATTR_DataSource_precision__AllowedValues() { return sensorPrecisionTypeDescription.AllowedValues; }
    get DataSource_precision() { return this._DataSource_precision; }
    set DataSource_precision(value) { this._DataSource_precision = value; }
    get ATTR_DataSource_AlarmSection0__DisplayName() { return "Sensor value alarm 1"; }
    get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_AlarmSection0__DescriptionAttribute() { return "Alarm 1 for this data source, expand for more."; }
    get DataSource_AlarmSection0() { return this._DataSource_AlarmSection0; }
    set DataSource_AlarmSection0(value) { this._DataSource_AlarmSection0 = value; }
    get ATTR_DataSource_AlarmSection1__DisplayName() { return "Sensor value alarm 2"; }
    get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__CategoryAttribute() { return "Data source"; }
    get ATTR_DataSource_AlarmSection1__DescriptionAttribute() { return "Alarm 2 for this data source, expand for more."; }
    get DataSource_AlarmSection1() { return this._DataSource_AlarmSection1; }
    set DataSource_AlarmSection1(value) { this._DataSource_AlarmSection1 = value; }
    get ATTR_display_font__DisplayName() { return "Font"; }
    get ATTR_display_font__CategoryAttribute() { return "Display"; }
    get ATTR_display_font__ReadOnlyAttribute() { return true; }
    get ATTR_display_font__DescriptionAttribute() { return "Display font"; }
    get display_font() { return this._font; }
    set display_font(value) { this._font = value; }
    get ATTR_display_backgroundColor1__DisplayName() { return "Background color 1"; }
    get ATTR_display_backgroundColor1__CategoryAttribute() { return "Display"; }
    get ATTR_display_backgroundColor1__DescriptionAttribute() { return "Display background gradient color 1."; }
    get display_backgroundColor1() { return this._display_backgroundColor1; }
    set display_backgroundColor1(value) { this._display_backgroundColor1 = value; }
    get ATTR_display_backgroundColor2__DisplayName() { return "Background color 2"; }
    get ATTR_display_backgroundColor2__CategoryAttribute() { return "Display"; }
    get ATTR_display_backgroundColor2__DescriptionAttribute() { return "Display background gradient color 2."; }
    get display_backgroundColor2() { return this._display_backgroundColor2; }
    set display_backgroundColor2(value) { this._display_backgroundColor2 = value; }
    get ATTR_display_hrzAlignment__DisplayName() { return "Hrz alignment method"; }
    get ATTR_display_hrzAlignment__CategoryAttribute() { return "Display"; }
    get ATTR_display_hrzAlignment__DescriptionAttribute() { return "Horizontal alignment method"; }
    get display_hrzAlignment() { return this._hrzAlignment; }
    set display_hrzAlignment(value) { this._hrzAlignment = value; }
    get ATTR_display_hrzAlignmentOfset__DisplayName() { return "Hrz alignment offset"; }
    get ATTR_display_hrzAlignmentOfset__CategoryAttribute() { return "Display"; }
    get ATTR_display_hrzAlignmentOfset__DescriptionAttribute() { return "Horizontal alignment offset in percentage. No effect when chosen horizontal alignment is CENTER"; }
    get display_hrzAlignmentOfset() { return this._hrzAlignmentOfset; }
    set display_hrzAlignmentOfset(value) { this._hrzAlignmentOfset = value; }
    get ATTR_display_outOfRangeMin__DisplayName() { return "Minimum value"; }
    get ATTR_display_outOfRangeMin__CategoryAttribute() { return "Range Control"; }
    get ATTR_display_outOfRangeMin__DescriptionAttribute() { return "Regular range minimum value. if value goes  outside regular  range, color will turn to \"Out of range Color\".Leave blank if you don't want to define such a range. "; }
    get display_outOfRangeMin() { return this._outOfRangeMin; }
    set display_outOfRangeMin(value) { this._outOfRangeMin = value; }
    get ATTR_display_outOfRangeMax__DisplayName() { return "Maximum value"; }
    get ATTR_display_outOfRangeMax__CategoryAttribute() { return "Range Control"; }
    get ATTR_display_outOfRangeMax__DescriptionAttribute() { return "Regular range minimum value. if value goes  outside regular  range, color will turn to \"Out of range Color\".Leave blank if you don't want to define such a range. "; }
    get display_outOfRangeMax() { return this._outOfRangeMax; }
    set display_outOfRangeMax(value) { this._outOfRangeMax = value; }
    get ATTR_display_outOfRangeColor__DisplayName() { return "Out of range Color"; }
    get ATTR_display_outOfRangeColor__CategoryAttribute() { return "Range Control"; }
    get ATTR_display_outOfRangeColor__DescriptionAttribute() { return "Digits color when value is out of range."; }
    get display_outOfRangeColor() { return this._outOfRangeColor; }
    set display_outOfRangeColor(value) { this._outOfRangeColor = value; }
    get ATTR_display_annotationPanels0__DisplayName() { return "Annotation 1"; }
    get ATTR_display_annotationPanels0__CategoryAttribute() { return "Annotations"; }
    get ATTR_display_annotationPanels0__ReadOnlyAttribute() { return true; }
    get ATTR_display_annotationPanels0__DescriptionAttribute() { return "Customizable text panels"; }
    get display_annotationPanels0() { return this._annotationPanels0; }
    set display_annotationPanels0(value) { this._annotationPanels0 = value; }
    get ATTR_display_annotationPanels1__DisplayName() { return "Annotation 2"; }
    get ATTR_display_annotationPanels1__CategoryAttribute() { return "Annotations"; }
    get ATTR_display_annotationPanels1__ReadOnlyAttribute() { return true; }
    get ATTR_display_annotationPanels1__DescriptionAttribute() { return "Customizable text panels"; }
    get display_annotationPanels1() { return this._annotationPanels1; }
    set display_annotationPanels1(value) { this._annotationPanels1 = value; }
}
/****************************************
 * Alarm section
 */
export class AlarmSection {
    get summary() {
        let c = this._sensor.getAlarmCondition(this._index);
        if (c == 0)
            return "Disabled";
        return "Enabled";
    }
    constructor(index) {
        this._sensor = YoctoVisualization.sensorsManager.getNullSensor();
        this._index = 0;
        this._index = index;
    }
    get ATTR_source__DisplayName() { return "Data source type"; }
    get ATTR_source__NotSavedInXMLAttribute() { return true; }
    get ATTR_source__AllowedValues() { return sensorDataTypeDescription.AllowedValues; }
    get ATTR_source__DescriptionAttribute() { return "Alarm sensor data source (Average, minimum or maximum value during last interval)"; }
    get source() { return this._sensor.getAlarmSource(this._index); }
    set source(value) { this._sensor.setAlarmSource(this._index, value); }
    get ATTR_condition__DisplayName() { return "Test Condition"; }
    get ATTR_condition__NotSavedInXMLAttribute() { return true; }
    get ATTR_condition__AllowedValues() { return AlarmTestTypeDescription.AllowedValues; }
    get ATTR_condition__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_condition__DescriptionAttribute() { return "Alarm trigger condition"; }
    get condition() { return this._sensor.getAlarmCondition(this._index); }
    set condition(value) { this._sensor.setAlarmCondition(this._index, value); }
    setDataSource(sensor) { this._sensor = sensor; }
    get ATTR_value__DisplayName() { return "Test Value"; }
    get ATTR_value__NotSavedInXMLAttribute() { return true; }
    get ATTR_value__DescriptionAttribute() { return "Value for the Alarm trigger"; }
    get value() { return this._sensor.getAlarmValue(this._index); }
    set value(value) { this._sensor.setAlarmValue(this._index, value); }
    get ATTR_commandLine__DisplayName() { return "Trigger action"; }
    get ATTR_commandLine__NotSavedInXMLAttribute() { return true; }
    get ATTR_commandLine__DescriptionAttribute() { return "Javascript snippet executed in your browser each time the alarm is triggered, you can use the following variables: $SENSORVALUE$, $UNIT$, $HWDID$, $NAME$, $CONDITION$, $TRIGGER$, $DATATYPE$, $NOW$. Example : <tt>alarm('Warning $NAME$ = $SENSORVALUE$!');</tt>. You can check logs to find out if your alarm code works."; }
    get commandLine() { return this._sensor.getAlarmCommandline(this._index); }
    set commandLine(value) { this._sensor.setAlarmCommandline(this._index, value); }
    get ATTR_delay__DisplayName() { return "Trigger delay"; }
    get ATTR_delay__NotSavedInXMLAttribute() { return true; }
    get ATTR_delay__DescriptionAttribute() { return "Minimum delay, in seconds, between two alarms. Think carefully and make sure you won't create alarm storms."; }
    get delay() { return this._sensor.getAlarmDelay(this._index); }
    ;
    set delay(value) { this._sensor.setAlarmDelay(this._index, value); }
    ;
}
/*********************************
 * SERIES
 */
export class ChartSerie {
    constructor(defaultColor) {
        this.ownerForm = null;
        this.index = -1;
        this._DataSource_source = YoctoVisualization.sensorsManager.getNullSensor();
        this._DataType = 0;
        this._thickness = 2.0;
        this._legend = "";
        this._color = YDataRendering.YColor.Red;
        this._yAxisIndex = 0;
        this._DataSource_AlarmSection0 = new AlarmSection(0);
        this._DataSource_AlarmSection1 = new AlarmSection(1);
        this._color = defaultColor;
    }
    get summary() { return this._DataSource_source instanceof YoctoVisualization.NullYSensor ? "none" : this._DataSource_source.get_friendlyName() + (this._DataSource_source.isOnline() ? "" : " - OFFLINE"); }
    Init(owner, serieIndex) {
        this.ownerForm = owner;
        this.index = serieIndex;
        this.PropagateDataSourceChange(this._DataSource_source);
    }
    PropagateDataSourceChange(value) {
        this.ownerForm.SourceChanged(this._DataSource_source, this.index);
        let props = YoctoVisualization.GenericProperties.getAllProperties(this).byName;
        let name;
        for (name in props) {
            if (name.startsWith("DataSource_AlarmSection")) {
                this[name].setDataSource(this._DataSource_source); // not sure it will work
            }
        }
    }
    get ATTR_DataSource_source__DisplayName() { return "Sensor"; }
    get ATTR_DataSource_source__CopyToTarget() { return false; } // this extra property doesn't exist is graph's series
    get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_DataSource_source__DescriptionAttribute() { return "Yoctopuce sensor feeding the graph. " + GenericHints.CheckSensor; }
    get DataSource_source() { return this._DataSource_source; }
    set DataSource_source(value) {
        let prev = this._DataSource_source;
        this._DataSource_source = value;
        //#ifndef READONLY
        if (this._DataSource_source != prev)
            YoctoVisualization.constants.edited = true;
        //#endif
        if (this.ownerForm != null)
            this.PropagateDataSourceChange(this._DataSource_source);
    }
    get isSensorReadOnly() { return this._DataSource_source.isReadOnly; }
    get ATTR_DataSource_freq__DisplayName() { return "Sensor frequency"; }
    get ATTR_DataSource_freq__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_freq__CopyToTarget() { return false; } // this extra property doesn't exist is graph's series
    get ATTR_DataSource_freq__IsReadonlyCallAttribute() { return "isSensorReadOnly"; }
    get ATTR_DataSource_freq__DescriptionAttribute() { return "Sensor data acquisition frequency." + GenericHints.DevConfAffected; }
    get ATTR_DataSource_freq__AllowedValues() { return sensorFreqTypeDescription.AllowedValues; }
    get DataSource_freq() { return this._DataSource_source.get_frequency(); }
    set DataSource_freq(value) { this._DataSource_source.set_frequency(value); }
    get ATTR_DataSource_datatype__DisplayName() { return "Sensor data"; }
    get ATTR_DataSource_datatype__AllowedValues() { return sensorDataTypeDescription.AllowedValues; }
    get ATTR_DataSource_datatype__CopyToTarget() { return false; } // this extra property doesn't exist is graph's series
    get ATTR_DataSource_datatype__DescriptionAttribute() { return "Which data for sensor are displayed on the graph. Min and Max are available only for frequencies <1Hz"; }
    get DataSource_datatype() { return this._DataType; }
    set DataSource_datatype(value) {
        this._DataType = value;
        if (this.ownerForm != null) {
            this.ownerForm.SourceChanged(this._DataSource_source, this.index);
        }
    }
    get ATTR_DataSource_recording__DisplayName() { return "Sensor recording"; }
    get ATTR_DataSource_recording__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_recording__IsReadonlyCallAttribute() { return "isSensorReadOnly"; }
    get ATTR_DataSource_recording__CopyToTarget() { return false; } // this extra property doesn't exist is graph's series
    get ATTR_DataSource_recording__DescriptionAttribute() { return "Enable/ disable sensor data recording in the device on-board datalogger." + GenericHints.DevConfAffected; }
    get DataSource_recording() { return this._DataSource_source.get_recording(); }
    set DataSource_recording(value) { this._DataSource_source.set_recording(value); }
    get ATTR_thickness__DisplayName() { return "Thickness"; }
    get ATTR_thickness__DescriptionAttribute() { return "Line thickness."; }
    get thickness() { return this._thickness; }
    set thickness(value) { this._thickness = value; }
    get ATTR_legend__DisplayName() { return "Legend"; }
    get ATTR_legend__DescriptionAttribute() { return "Short description of the series."; }
    get legend() { return this._legend; }
    set legend(value) { this._legend = value; }
    get ATTR_color__DisplayName() { return "Color"; }
    get ATTR_color__DescriptionAttribute() { return "Line color."; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
    get ATTR_yAxisIndex__AllowedValues() { return yAxisDescription.AllowedValues; }
    get ATTR_yAxisIndex__DisplayName() { return "Y axis"; }
    get ATTR_yAxisIndex__DescriptionAttribute() { return "Choose which Y axis the data with be scaled to."; }
    get yAxisIndex() { return this._yAxisIndex; }
    set yAxisIndex(value) { this._yAxisIndex = value; }
    get ATTR_DataSource_AlarmSection0__DisplayName() { return "Sensor value alarm 1"; }
    get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection0__DescriptionAttribute() { return "Alarm 1 for this data source, expand for more."; }
    get DataSource_AlarmSection0() { return this._DataSource_AlarmSection0; }
    set DataSource_AlarmSection0(value) { this._DataSource_AlarmSection0 = value; }
    get ATTR_DataSource_AlarmSection1__DisplayName() { return "Sensor value alarm 2"; }
    get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() { return true; }
    get ATTR_DataSource_AlarmSection1__DescriptionAttribute() { return "Alarm 2 for this data source, expand for more."; }
    get DataSource_AlarmSection1() { return this._DataSource_AlarmSection1; }
    set DataSource_AlarmSection1(value) { this._DataSource_AlarmSection1 = value; }
}
//****************************
//  Legend panel
//
//****************************
export class LegendPanelDescription {
    constructor() {
        this._enabled = false;
        this._overlap = false;
        this._position = YDataRendering.LegendPanel.Position.RIGHT;
        this._font = new FontDescription("Arial", 7, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, true);
        this._bgColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
        this._borderColor = YDataRendering.YColor.Black;
        this._borderthickness = 1.0;
        this._padding = 10;
        this._verticalMargin = 10;
        this._horizontalMargin = 10;
        this._traceWidthFactor = 1;
    }
    get summary() { return this._enabled ? "Enabled" : "Disabled"; }
    get ATTR_enabled__DisplayName() { return "Enabled"; }
    get ATTR_enabled__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_enabled__DescriptionAttribute() { return "Should the legend panel be shown or not"; }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
    get ATTR_overlap__DisplayName() { return "Overlap"; }
    get ATTR_overlap__DescriptionAttribute() { return "Can the panel overlap the graph data, or should we explicitly make space for it?"; }
    get overlap() { return this._overlap; }
    set overlap(value) { this._overlap = value; }
    get ATTR_position__DisplayName() { return "Position"; }
    get ATTR_position__DescriptionAttribute() { return "Position of the legend panel"; }
    get position() { return this._position; }
    set position(value) { this._position = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Legend panel contents fonts"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
    get ATTR_bgColor__DisplayName() { return "Background color "; }
    get ATTR_bgColor__DescriptionAttribute() { return "Legend panel background color."; }
    get bgColor() { return this._bgColor; }
    set bgColor(value) { this._bgColor = value; }
    get ATTR_borderColor__DisplayName() { return "Border color "; }
    get ATTR_borderColor__DescriptionAttribute() { return "Legend panel border color."; }
    get borderColor() { return this._borderColor; }
    set borderColor(value) { this._borderColor = value; }
    get ATTR_borderthickness__DisplayName() { return "Border thickness "; }
    get ATTR_borderthickness__DescriptionAttribute() { return "Legend panel border thickness"; }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) { this._borderthickness = value; }
    get ATTR_padding__DisplayName() { return "Padding "; }
    get ATTR_padding__DescriptionAttribute() { return "Distance between the panel border and the panel contents"; }
    get padding() { return this._padding; }
    set padding(value) { this._padding = value; }
    get ATTR_verticalMargin__DisplayName() { return "Vertical margin "; }
    get ATTR_verticalMargin__DescriptionAttribute() { return "Vertical distance between the panel border and its surroundings"; }
    get verticalMargin() { return this._verticalMargin; }
    set verticalMargin(value) { this._verticalMargin = value; }
    get ATTR_horizontalMargin__DisplayName() { return "Horizontal margin "; }
    get ATTR_horizontalMargin__DescriptionAttribute() { return "Distance between the panel border and its surroundings"; }
    get horizontalMargin() { return this._horizontalMargin; }
    set horizontalMargin(value) { this._horizontalMargin = value; }
    get ATTR_traceWidthFactor__DisplayName() { return "Color Indicator Factor"; }
    get ATTR_traceWidthFactor__DescriptionAttribute() { return "Factor used to enlarge series color indicators shown in the legend panel"; }
    get traceWidthFactor() { return this._traceWidthFactor; }
    set traceWidthFactor(value) { this._traceWidthFactor = value; }
}
export class AnnotationPanelDescription {
    get summary() { return this._enabled ? "Enabled" : "Disabled"; }
    get ATTR_enabled__DisplayName() { return "Enabled"; }
    get ATTR_enabled__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_enabled__DescriptionAttribute() { return "Should the annotation panel be shown or not"; }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
    get ATTR_overlap__DisplayName() { return "Overlap"; }
    get ATTR_overlap__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_overlap__DescriptionAttribute() { return "Can the annotation panel overlap the display zone, or should the display zone be squeezed to make space for the panel?"; }
    get overlap() { return this._overlap; }
    set overlap(value) { this._overlap = value; }
    get ATTR_text__DisplayName() { return "Text "; }
    get ATTR_text__DescriptionAttribute() { return GenericHints.Annotation; }
    get text() { return this._text; }
    set text(value) { this._text = value; }
    get ATTR_panelTextAlign__DisplayName() { return "Text Alignment"; }
    get ATTR_panelTextAlign__DescriptionAttribute() { return "How text is aligned, makes sense on multi-lines text only."; }
    get panelTextAlign() { return this._panelTextAlign; }
    set panelTextAlign(value) { this._panelTextAlign = value; }
    get ATTR_panelHrzAlign__DisplayName() { return "X Position"; }
    get ATTR_panelHrzAlign__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_panelHrzAlign__DescriptionAttribute() { return "Annotation panel X position"; }
    get panelHrzAlign() { return this._panelHrzAlign; }
    set panelHrzAlign(value) { this._panelHrzAlign = value; }
    get ATTR_positionOffsetX__DisplayName() { return "X Offset"; }
    get ATTR_positionOffsetX__DescriptionAttribute() { return "X Position offset, in %  (overlap mode only)"; }
    get positionOffsetX() { return this._positionOffsetX; }
    set positionOffsetX(value) { this._positionOffsetX = value; }
    get ATTR_panelVrtAlign__DisplayName() { return "Y Position"; }
    get ATTR_panelVrtAlign__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_panelVrtAlign__DescriptionAttribute() { return "Annotation panel Y position"; }
    get panelVrtAlign() { return this._panelVrtAlign; }
    set panelVrtAlign(value) { this._panelVrtAlign = value; }
    get ATTR_positionOffsetY__DisplayName() { return "Y Offset"; }
    get ATTR_positionOffsetY__DescriptionAttribute() { return "Y Position offset, in %  (overlap mode only)"; }
    get positionOffsetY() { return this._positionOffsetY; }
    set positionOffsetY(value) { this._positionOffsetY = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Panel font"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
    get ATTR_bgColor__DisplayName() { return "Background color "; }
    get ATTR_bgColor__DescriptionAttribute() { return "Legend panel background color."; }
    get bgColor() { return this._bgColor; }
    set bgColor(value) { this._bgColor = value; }
    get ATTR_borderColor__DisplayName() { return "Border color "; }
    get ATTR_borderColor__DescriptionAttribute() { return "Legend panel border color."; }
    get borderColor() { return this._borderColor; }
    set borderColor(value) { this._borderColor = value; }
    get ATTR_borderthickness__DisplayName() { return "Border thickness "; }
    get ATTR_borderthickness__DescriptionAttribute() { return "Panel border thickness"; }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) { this._borderthickness = value; }
    get ATTR_padding__DisplayName() { return "Padding "; }
    get ATTR_padding__DescriptionAttribute() { return "Distance between the panel border and the panel contents"; }
    get padding() { return this._padding; }
    set padding(value) { this._padding = value; }
    constructor(hrzAlignInit, vrtAlignInit, offsetY, overlap, textInit, BgColorInit, BorderColorInit, fontSizeInit, FontColorInit) {
        this._enabled = false;
        this._overlap = false;
        this._text = "Date: $DAY$/$MONTH$/$YEAR$";
        this._panelTextAlign = YDataRendering.GenericPanel.TextAlign.CENTER;
        this._panelHrzAlign = YDataRendering.GenericPanel.HorizontalAlignPos.CENTER;
        this._positionOffsetX = 0;
        this._panelVrtAlign = YDataRendering.GenericPanel.VerticalAlignPos.TOP;
        this._positionOffsetY = 0;
        this._font = new FontDescription("Arial", 12, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, false);
        this._bgColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
        this._borderColor = YDataRendering.YColor.Black;
        this._borderthickness = 1.0;
        this._padding = 5;
        if (typeof textInit != "undefined")
            this._text = textInit;
        if (typeof offsetY != "undefined")
            this._positionOffsetY = offsetY;
        if (typeof overlap != "undefined")
            this._overlap = overlap;
        if (typeof BgColorInit != "undefined")
            this._bgColor = BgColorInit;
        if (typeof BorderColorInit != "undefined")
            this._borderColor = BorderColorInit;
        if (typeof fontSizeInit != "undefined")
            this._font.size = fontSizeInit;
        if (typeof FontColorInit != "undefined")
            this._font.color = FontColorInit;
        if (typeof vrtAlignInit != "undefined")
            this._panelVrtAlign = vrtAlignInit;
        if (typeof hrzAlignInit != "undefined")
            this._panelHrzAlign = hrzAlignInit;
    }
}
export class AnnotationPanelDescriptionGraph extends AnnotationPanelDescription {
    // position,
    get ATTR_enabled__DisplayName() { return "Enabled"; }
    get ATTR_enabled__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_enabled__DescriptionAttribute() { return "Should the annotation panel be shown or not"; }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
    get ATTR_overlap__DisplayName() { return "Overlap"; }
    get ATTR_overlap__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_overlap__DescriptionAttribute() { return "Can the annotation panel overlap the graph, or should the graph be squeezed to make space for the panel?"; }
    get overlap() { return this._overlap; }
    set overlap(value) { this._overlap = value; }
    get ATTR_text__DisplayName() { return "Text "; }
    get ATTR_text__DescriptionAttribute() { return GenericHints.AnnotationGraph; }
    get text() { return this._text; }
    set text(value) { this._text = value; }
}
export class DataTrackerDescription {
    constructor() {
        this._enabled = false;
        this._showSerieName = false;
        this._showTimeStamp = false;
        this._dataPrecision = DataTrackerDescription.DataPrecision.PRECISION_NOLIMIT;
        this._diameter = 5;
        this._handleLength = 25;
        this._font = new FontDescription("Arial", 7, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, false);
        this._bgColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
        this._borderColor = YDataRendering.YColor.Black;
        this._borderthickness = 1.0;
        this._padding = 5;
        this._detectionDistance = 50;
    }
    get summary() { return this._enabled ? "Enabled" : "Disabled"; }
    get ATTR_enabled__DisplayName() { return "Enabled"; }
    get ATTR_enabled__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_enabled__DescriptionAttribute() { return "Should the data tracker be shown or not."; }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
    get ATTR_showSerieName__DisplayName() { return "Show Series legend"; }
    get ATTR_showSerieName__DescriptionAttribute() { return "Should the data tracker show the value's series legend."; }
    get showSerieName() { return this._showSerieName; }
    set showSerieName(value) { this._showSerieName = value; }
    get ATTR_showTimeStamp__DisplayName() { return "Show Timestamp"; }
    get ATTR_showTimeStamp__DescriptionAttribute() { return "Should the data tracker show the value's timestamp."; }
    get showTimeStamp() { return this._showTimeStamp; }
    set showTimeStamp(value) { this._showTimeStamp = value; }
    get ATTR_dataPrecision__DisplayName() { return "Precision"; }
    get ATTR_dataPrecision__DescriptionAttribute() { return "A way to limit data precision to meaningful digits in the data tracker."; }
    get dataPrecision() { return this._dataPrecision; }
    set dataPrecision(value) { this._dataPrecision = value; }
    get ATTR_diameter__DisplayName() { return "Point Diameter"; }
    get ATTR_diameter__DescriptionAttribute() { return "Data point diameter, in pixels"; }
    get diameter() { return this._diameter; }
    set diameter(value) { this._diameter = value; }
    get ATTR_handleLength__DisplayName() { return "Handle size"; }
    get ATTR_handleLength__DescriptionAttribute() { return "size of the handle between the data point and the value panel"; }
    get handleLength() { return this._handleLength; }
    set handleLength(value) { this._handleLength = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Data tracker label fonts"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
    get ATTR_bgColor__DisplayName() { return "Background color"; }
    get ATTR_bgColor__DescriptionAttribute() { return "Value panel ground color."; }
    get bgColor() { return this._bgColor; }
    set bgColor(value) { this._bgColor = value; }
    get ATTR_borderColor__DisplayName() { return "Border color"; }
    get ATTR_borderColor__DescriptionAttribute() { return "Value panel border and handle  color."; }
    get borderColor() { return this._borderColor; }
    set borderColor(value) { this._borderColor = value; }
    get ATTR_borderthickness__DisplayName() { return "Border thickness "; }
    get ATTR_borderthickness__DescriptionAttribute() { return "Value panel border and handle  thickness"; }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) { this._borderthickness = value; }
    get ATTR_padding__DisplayName() { return "Padding"; }
    get ATTR_padding__DescriptionAttribute() { return "Distance between the panel border and its contents "; }
    get padding() { return this._padding; }
    set padding(value) { this._padding = value; }
    get ATTR_detectionDistance__DisplayName() { return "Detection distance"; }
    get ATTR_detectionDistance__DescriptionAttribute() { return "Maximum distance, in pixels, between the mouse and a data point for data tracker to show. Use zero for infinite distance"; }
    get detectionDistance() { return this._detectionDistance; }
    set detectionDistance(value) { this._detectionDistance = value; }
}
(function (DataTrackerDescription) {
    class DataPrecisionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, DataPrecision);
        }
    }
    DataTrackerDescription.DataPrecisionEnumItem = DataPrecisionEnumItem;
    class DataPrecision extends YDataRendering.YEnum {
    }
    DataPrecision.PRECISION_NOLIMIT = new DataPrecisionEnumItem("PRECISION_NOLIMIT", "As is");
    DataPrecision.PRECISION_1 = new DataPrecisionEnumItem("PRECISION_1", "1");
    DataPrecision.PRECISION_01 = new DataPrecisionEnumItem("PRECISION_01", "0.1");
    DataPrecision.PRECISION_001 = new DataPrecisionEnumItem("PRECISION_001", "0.01");
    DataPrecision.PRECISION_0001 = new DataPrecisionEnumItem("PRECISION_0001", "0.001");
    DataTrackerDescription.DataPrecision = DataPrecision;
})(DataTrackerDescription || (DataTrackerDescription = {}));
//****************************
//  graph navigator
//
//****************************
export class NavigatorDescription {
    get summary() { return this._enabled ? "Enabled" : "Disabled"; }
    constructor() {
        this._enabled = false;
        this._bgColor1 = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
        this._bgColor2 = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
        this._borderThickness = 1.0;
        this._borderColor = YDataRendering.YColor.Black;
        this._cursorColor = YDataRendering.YColor.FromArgb(25, 0, 255, 0);
        this._cursorBorderColor = YDataRendering.YColor.FromArgb(255, 96, 96, 96);
        this._yAxisHandling = YDataRendering.Navigator.YAxisHandling.AUTO;
        this._xAxisThickness = 1.0;
        this._xAxisColor = YDataRendering.YColor.Black;
        this._font = new FontDescription("Arial", 10, YDataRendering.YColor.FromArgb(255, 32, 32, 32), false, false);
    }
    get ATTR_enabled__DisplayName() { return "Enabled"; }
    get ATTR_enabled__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_enabled__DescriptionAttribute() { return "Should the navigator be shown or not."; }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
    get ATTR_bgColor1__DisplayName() { return "Background color 1"; }
    get ATTR_bgColor1__DescriptionAttribute() { return "Navigator background gradient color 1."; }
    get bgColor1() { return this._bgColor1; }
    set bgColor1(value) { this._bgColor1 = value; }
    get ATTR_bgColor2__DisplayName() { return "Background color 2"; }
    get ATTR_bgColor2__DescriptionAttribute() { return "Navigator background gradient color 2."; }
    get bgColor2() { return this._bgColor2; }
    set bgColor2(value) { this._bgColor2 = value; }
    get ATTR_borderThickness__DisplayName() { return "Border thickness"; }
    get ATTR_borderThickness__DescriptionAttribute() { return "Navigator"; }
    get borderThickness() { return this._borderThickness; }
    set borderThickness(value) { this._borderThickness = value; }
    get ATTR_borderColor__DisplayName() { return "Border color"; }
    get ATTR_borderColor__DescriptionAttribute() { return "Navigator Border color."; }
    get borderColor() { return this._borderColor; }
    set borderColor(value) { this._borderColor = value; }
    get ATTR_cursorColor__DisplayName() { return "Navigator cursor fill color"; }
    get ATTR_cursorColor__DescriptionAttribute() { return "Navigator"; }
    get cursorColor() { return this._cursorColor; }
    set cursorColor(value) { this._cursorColor = value; }
    get ATTR_cursorBorderColor__DisplayName() { return "Navigator cursor left/right border color."; }
    get ATTR_cursorBorderColor__DescriptionAttribute() { return "Navigator"; }
    get cursorBorderColor() { return this._cursorBorderColor; }
    set cursorBorderColor(value) { this._cursorBorderColor = value; }
    get ATTR_yAxisHandling__DisplayName() { return "Y axis range"; }
    get ATTR_yAxisHandling__DescriptionAttribute() { return "Is navigator Y axis zoom automatic or inherited from main view settings?"; }
    get yAxisHandling() { return this._yAxisHandling; }
    set yAxisHandling(value) { this._yAxisHandling = value; }
    get ATTR_xAxisThickness__DisplayName() { return "X axis thickness"; }
    get ATTR_xAxisThickness__DescriptionAttribute() { return "Navigator"; }
    get xAxisThickness() { return this._xAxisThickness; }
    set xAxisThickness(value) { this._xAxisThickness = value; }
    get ATTR_xAxisColor__DisplayName() { return "X axis color"; }
    get ATTR_xAxisColor__DescriptionAttribute() { return "Navigator X axis color."; }
    get xAxisColor() { return this._xAxisColor; }
    set xAxisColor(value) { this._xAxisColor = value; }
    get ATTR_font__DisplayName() { return "X-Axis Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Navigator X axis font"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
}
//****************************
//  graph Legend
//
//****************************
export class LegendDescription {
    constructor() {
        this._title = "";
        this._font = new FontDescription("Arial", 12, YDataRendering.YColor.Black, false, true);
    }
    get ATTR_title__DisplayName() { return "Text"; }
    get ATTR_title__DescriptionAttribute() { return "Legend text"; }
    get title() { return this._title; }
    set title(value) { this._title = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Legend font"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
}
//****************************
//  graph Y-axis
//
//****************************
export class YaxisDescription {
    constructor(index, shown) {
        this._visible = false;
        this._position = YDataRendering.YAxis.HrzPosition.LEFT;
        this._min = new YoctoVisualization.doubleNan(Number.NaN);
        this._max = new YoctoVisualization.doubleNan(Number.NaN);
        this._step = new YoctoVisualization.doubleNan(Number.NaN);
        this._color = YDataRendering.YColor.FromArgb(255, 127, 127, 127);
        this._thickness = 1.0;
        this._showGrid = false;
        this._gridColor = YDataRendering.YColor.FromArgb(255, 210, 210, 210);
        this._gridThickness = 1.0;
        this._font = new FontDescription("Arial", 10, YDataRendering.YColor.Black, false, false);
        this._legend = new LegendDescription();
        this._zones0 = new ZoneDescription(0, 50, YDataRendering.YColor.LightGreen);
        this._zones1 = new ZoneDescription(50, 80, YDataRendering.YColor.Yellow);
        this._zones2 = new ZoneDescription(80, 100, YDataRendering.YColor.Red);
        this._visible = shown;
        this._showGrid = index == 0;
        this._position = index == 0 ? YDataRendering.YAxis.HrzPosition.LEFT : YDataRendering.YAxis.HrzPosition.RIGHT;
    }
    get summary() { return this._visible ? "Enabled" : "Disabled"; }
    get ATTR_visible__DisplayName() { return "Visible"; }
    get ATTR_visible__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_visible__DescriptionAttribute() { return "Should that YAxis be shown?."; }
    get visible() { return this._visible; }
    set visible(value) { this._visible = value; }
    get ATTR_position__DisplayName() { return "Position"; }
    get ATTR_position__DescriptionAttribute() { return "Y Axis position (left / right)"; }
    get position() { return this._position; }
    set position(value) { this._position = value; }
    get ATTR_min__DisplayName() { return "Minimum value"; }
    get ATTR_min__DescriptionAttribute() { return "YAxis minimum value, leave blank for automatic behavior."; }
    get min() { return this._min; }
    set min(value) { this._min = value; }
    get ATTR_max__DisplayName() { return "Maximum value"; }
    get ATTR_max__DescriptionAttribute() { return "YAxis maximum value, leave blank for automatic behavior."; }
    get max() { return this._max; }
    set max(value) { this._max = value; }
    get ATTR_step__DisplayName() { return "Steps"; }
    get ATTR_step__DescriptionAttribute() { return "YAxis step size, leave blank for automatic behavior."; }
    get step() { return this._step; }
    set step(value) { this._step = value; }
    get ATTR_color__DisplayName() { return "Color"; }
    get ATTR_color__DescriptionAttribute() { return "Y Axis Color."; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
    get ATTR_thickness__DisplayName() { return "Thickness"; }
    get ATTR_thickness__DescriptionAttribute() { return "Axis thickness"; }
    get thickness() { return this._thickness; }
    set thickness(value) { this._thickness = value; }
    get ATTR_showGrid__DisplayName() { return "Show Grid"; }
    get ATTR_showGrid__DescriptionAttribute() { return "Show grid horizontal lines, or not."; }
    get showGrid() { return this._showGrid; }
    set showGrid(value) { this._showGrid = value; }
    get ATTR_gridColor__DisplayName() { return "Grid Color"; }
    get ATTR_gridColor__DescriptionAttribute() { return "Grid horizontal lines color."; }
    get gridColor() { return this._gridColor; }
    set gridColor(value) { this._gridColor = value; }
    get ATTR_gridThickness__DisplayName() { return "Grid thickness"; }
    get ATTR_gridThickness__DescriptionAttribute() { return "Grid horizontal lines thickness"; }
    get gridThickness() { return this._gridThickness; }
    set gridThickness(value) { this._gridThickness = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Axis font"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
    get ATTR_legend__DisplayName() { return "Legend"; }
    get ATTR_legend__DescriptionAttribute() { return "Axis legend"; }
    get legend() { return this._legend; }
    set legend(value) { this._legend = value; }
    get ATTR_zones0__DisplayName() { return "Zone 1"; }
    get ATTR_zones0__CategoryAttribute() { return "Zones"; }
    get ATTR_zones0__ReadOnlyAttribute() { return true; }
    get ATTR_zones0__DescriptionAttribute() { return "Zone 1 parameters"; }
    get zones0() { return this._zones0; }
    set zones0(value) { this._zones0 = value; }
    get ATTR_zones1__DisplayName() { return "Zone 2"; }
    get ATTR_zones1__CategoryAttribute() { return "Zones"; }
    get ATTR_zones1__ReadOnlyAttribute() { return true; }
    get ATTR_zones1__DescriptionAttribute() { return "Zone 2 parameters"; }
    get zones1() { return this._zones1; }
    set zones1(value) { this._zones1 = value; }
    get ATTR_zones2__DisplayName() { return "Zone 3"; }
    get ATTR_zones2__CategoryAttribute() { return "Zones"; }
    get ATTR_zones2__ReadOnlyAttribute() { return true; }
    get ATTR_zones2__DescriptionAttribute() { return "Zone 3 parameters"; }
    get zones2() { return this._zones2; }
    set zones2(value) { this._zones2 = value; }
}
//****************************
//  graph X-axis markers
//
//****************************
export class MarkerDescription {
    constructor(defaultText) {
        this._enabled = false;
        this._text = "";
        this._textAlign = YDataRendering.Marker.TextAlign.CENTER;
        this._timereference = YDataRendering.TimeConverter.TimeReference.ABSOLUTE;
        this._positionOnXAxis = new YDataRendering.xAxisPosition(YDataRendering.TimeConverter.ToUnixTime(new Date()), false);
        this._yposition = 95;
        this._bgColor = YDataRendering.YColor.FromArgb(200, 255, 255, 192);
        this._borderColor = YDataRendering.YColor.DarkRed;
        this._borderthickness = 1.0;
        this._padding = 5;
        this._font = new FontDescription("Arial", 7, YDataRendering.YColor.Black, false, false);
        this._text = defaultText;
    }
    get summary() { return this._enabled ? "Enabled" : "Disabled"; }
    get ATTR_enabled__DisplayName() { return "Enabled"; }
    get ATTR_enabled__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_enabled__DescriptionAttribute() { return "Should that marker be shown?."; }
    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }
    get ATTR_text__DisplayName() { return "Text"; }
    get ATTR_text__DescriptionAttribute() { return "Marker text. Use \\n for multi-line text. Some variables are allowed such as $MARKERTIME$, $LEGEND1$, $VALUE1$, $UNIT1$, $LEGEND1$, $VALUE2$ etc.. Extensive use of marker variables migh make the graph rendering significantly slower."; }
    get text() { return this._text; }
    set text(value) { this._text = value; }
    get ATTR_textAlign__DisplayName() { return "Text Alignment"; }
    get ATTR_textAlign__DescriptionAttribute() { return "How text is aligned, makes sense on multi-lines text only."; }
    get textAlign() { return this._textAlign; }
    set textAlign(value) { this._textAlign = value; }
    get ATTR_timereference__DisplayName() { return "Time reference"; }
    get ATTR_timereference__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_timereference__NotSavedInXMLAttribute() { return true; }
    get ATTR_timereference__DescriptionAttribute() { return "Should the marker time position be absolute or relative to first data timestamp? Note: relative markers won't be drawn until there is actual data."; }
    get timereference() { return this._timereference; }
    set timereference(value) {
        this._timereference = value;
        this._positionOnXAxis.relative = value == (YDataRendering.TimeConverter.TimeReference.RELATIVE);
    }
    get ATTR_positionOnXAxis__DisplayName() { return "Time position"; }
    get ATTR_positionOnXAxis__DescriptionAttribute() { return "Marker position on X axis."; }
    get positionOnXAxis() { return this._positionOnXAxis; }
    set positionOnXAxis(value) {
        this._positionOnXAxis = value;
        this.timereference = value.relative ? YDataRendering.TimeConverter.TimeReference.RELATIVE : YDataRendering.TimeConverter.TimeReference.ABSOLUTE;
    }
    get ATTR_yposition__DisplayName() { return "Vrt position (%)"; }
    get ATTR_yposition__DescriptionAttribute() { return "Vertical position of the marker label in % of available space. Zero is bottom"; }
    get yposition() { return this._yposition; }
    set yposition(value) { this._yposition = value; }
    get ATTR_bgColor__DisplayName() { return "Background color "; }
    get ATTR_bgColor__DescriptionAttribute() { return "Marker  background color."; }
    get bgColor() { return this._bgColor; }
    set bgColor(value) { this._bgColor = value; }
    get ATTR_borderColor__DisplayName() { return "Border color "; }
    get ATTR_borderColor__DescriptionAttribute() { return "Marker border color."; }
    get borderColor() { return this._borderColor; }
    set borderColor(value) { this._borderColor = value; }
    get ATTR_borderthickness__DisplayName() { return "Border thickness "; }
    get ATTR_borderthickness__DescriptionAttribute() { return "Marker border thickness, in pixels."; }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) { this._borderthickness = value; }
    get ATTR_padding__DisplayName() { return "Padding "; }
    get ATTR_padding__DescriptionAttribute() { return "Distance between the marker border and the marker contents, in pixels."; }
    get padding() { return this._padding; }
    set padding(value) { this._padding = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Marker Font"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
}
//****************************
//  graph X-axis
//
//****************************
export class XaxisDescription {
    constructor() {
        this._initialZoom = 60;
        this._initialOffset = 0;
        this._position = YDataRendering.XAxis.VrtPosition.BOTTOM;
        this._timeReference = YDataRendering.TimeConverter.TimeReference.ABSOLUTE;
        this._overflowHandling = YDataRendering.XAxis.OverflowHandling.SCROLL;
        this._color = YDataRendering.YColor.FromArgb(255, 127, 127, 127);
        this._thickness = 1.0;
        this._showGrid = false;
        this._gridColor = YDataRendering.YColor.FromArgb(50, 0, 0, 0);
        this._gridThickness = 1.0;
        this._font = new FontDescription("Arial", 10, YDataRendering.YColor.Black, false, false);
        this._legend = new LegendDescription();
        this._markers0 = new MarkerDescription("Marker 1");
        this._markers1 = new MarkerDescription("Marker 2");
        this._markers2 = new MarkerDescription("Marker 3");
        this._markers3 = new MarkerDescription("Marker 4");
        this._markers4 = new MarkerDescription("Marker 5");
        this._markers5 = new MarkerDescription("Marker 6");
        this._markers6 = new MarkerDescription("Marker 7");
        this._markers7 = new MarkerDescription("Marker 8");
    }
    get ATTR_initialZoom__DisplayName() { return "Initial Zoom"; }
    get ATTR_initialZoom__DescriptionAttribute() { return "Zoom level at application startup, i.e. width of the view-port in seconds."; }
    get initialZoom() { return this._initialZoom; }
    set initialZoom(value) { this._initialZoom = value; }
    get ATTR_initialOffset__DisplayName() { return "Initial Offset"; }
    get ATTR_initialOffset__DescriptionAttribute() { return "Offset of the first data point in percentage of the viewport width. For instance a 50% value will put the first point in the middle of the viewport. This can be used to give some room for datalogger contents."; }
    get initialOffset() { return this._initialOffset; }
    set initialOffset(value) { this._initialOffset = value; }
    get ATTR_position__DisplayName() { return "Position"; }
    get ATTR_position__DescriptionAttribute() { return "X Axis position (top / bottom)"; }
    get position() { return this._position; }
    set position(value) { this._position = value; }
    get ATTR_timeReference__DisplayName() { return "Time reference"; }
    get ATTR_timeReference__DescriptionAttribute() { return "Are gradation timestamps absolute or relative to experiment start time? "; }
    get timeReference() { return this._timeReference; }
    set timeReference(value) { this._timeReference = value; }
    get ATTR_overflowHandling__DisplayName() { return "Overflow Handling"; }
    get ATTR_overflowHandling__DescriptionAttribute() { return "What to do when new data are about to reach the graph right border"; }
    get overflowHandling() { return this._overflowHandling; }
    set overflowHandling(value) { this._overflowHandling = value; }
    get ATTR_color__DisplayName() { return "Color"; }
    get ATTR_color__DescriptionAttribute() { return "X Axis Color."; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
    get ATTR_thickness__DisplayName() { return "Thickness"; }
    get ATTR_thickness__DescriptionAttribute() { return "Axis thickness"; }
    get thickness() { return this._thickness; }
    set thickness(value) { this._thickness = value; }
    get ATTR_showGrid__DisplayName() { return "Show Grid"; }
    get ATTR_showGrid__DescriptionAttribute() { return "Show grid vertical lines, or not."; }
    get showGrid() { return this._showGrid; }
    set showGrid(value) { this._showGrid = value; }
    get ATTR_gridColor__DisplayName() { return "Grid Color"; }
    get ATTR_gridColor__DescriptionAttribute() { return "Grid vertical lines color."; }
    get gridColor() { return this._gridColor; }
    set gridColor(value) { this._gridColor = value; }
    get ATTR_gridThickness__DisplayName() { return "Grid thickness"; }
    get ATTR_gridThickness__DescriptionAttribute() { return "Grid vertical lines thickness"; }
    get gridThickness() { return this._gridThickness; }
    set gridThickness(value) { this._gridThickness = value; }
    get ATTR_font__DisplayName() { return "Font"; }
    get ATTR_font__ReadOnlyAttribute() { return true; }
    get ATTR_font__DescriptionAttribute() { return "Axis font"; }
    get font() { return this._font; }
    set font(value) { this._font = value; }
    get ATTR_legend__DisplayName() { return "Legend"; }
    get ATTR_legend__ReadOnlyAttribute() { return true; }
    get ATTR_legend__DescriptionAttribute() { return "X Axis legend"; }
    get legend() { return this._legend; }
    set legend(value) { this._legend = value; }
    get ATTR_markers0__DisplayName() { return "Marker 1"; }
    get ATTR_markers0__ReadOnlyAttribute() { return true; }
    get ATTR_markers0__CategoryAttribute() { return "Markers"; }
    get ATTR_markers0__DescriptionAttribute() { return "First marker parameters"; }
    get markers0() { return this._markers0; }
    set markers0(value) { this._markers0 = value; }
    get ATTR_markers1__DisplayName() { return "Marker 2"; }
    get ATTR_markers1__ReadOnlyAttribute() { return true; }
    get ATTR_markers1__CategoryAttribute() { return "Markers"; }
    get ATTR_markers1__DescriptionAttribute() { return "Second marker parameters"; }
    get markers1() { return this._markers1; }
    set markers1(value) { this._markers1 = value; }
    get ATTR_markers2__DisplayName() { return "Marker 3"; }
    get ATTR_markers2__ReadOnlyAttribute() { return true; }
    get ATTR_markers2__CategoryAttribute() { return "Markers"; }
    get ATTR_markers2__DescriptionAttribute() { return "Third marker parameters"; }
    get markers2() { return this._markers2; }
    set markers2(value) { this._markers2 = value; }
    get ATTR_markers3__DisplayName() { return "Marker 4"; }
    get ATTR_markers3__ReadOnlyAttribute() { return true; }
    get ATTR_markers3__CategoryAttribute() { return "Markers"; }
    get ATTR_markers3__DescriptionAttribute() { return "Fourth marker parameters"; }
    get markers3() { return this._markers3; }
    set markers3(value) { this._markers3 = value; }
    get ATTR_markers4__DisplayName() { return "Marker 5"; }
    get ATTR_markers4__ReadOnlyAttribute() { return true; }
    get ATTR_markers4__CategoryAttribute() { return "Markers"; }
    get ATTR_markers4__DescriptionAttribute() { return "Fith marker parameters"; }
    get markers4() { return this._markers4; }
    set markers4(value) { this._markers4 = value; }
    get ATTR_markers5__DisplayName() { return "Marker 6"; }
    get ATTR_markers5__ReadOnlyAttribute() { return true; }
    get ATTR_markers5__CategoryAttribute() { return "Markers"; }
    get ATTR_markers5__DescriptionAttribute() { return "Sixth marker parameters"; }
    get markers5() { return this._markers5; }
    set markers5(value) { this._markers5 = value; }
    get ATTR_markers6__DisplayName() { return "Marker 7"; }
    get ATTR_markers6__ReadOnlyAttribute() { return true; }
    get ATTR_markers6__CategoryAttribute() { return "Markers"; }
    get ATTR_markers6__DescriptionAttribute() { return "Seventh marker parameters"; }
    get markers6() { return this._markers6; }
    set markers6(value) { this._markers6 = value; }
    get ATTR_markers7__DisplayName() { return "Marker 8"; }
    get ATTR_markers7__ReadOnlyAttribute() { return true; }
    get ATTR_markers7__CategoryAttribute() { return "Markers"; }
    get ATTR_markers7__DescriptionAttribute() { return "Height marker parameters"; }
    get markers7() { return this._markers7; }
    set markers7(value) { this._markers7 = value; }
}
//****************************
//  graph display
//
//****************************
export class GraphFormProperties extends YoctoVisualization.GenericProperties {
    constructor(initData, owner) {
        super(owner);
        this._Graph_series0 = new ChartSerie(YDataRendering.YColor.Tomato);
        this._Graph_series1 = new ChartSerie(YDataRendering.YColor.DodgerBlue);
        this._Graph_series2 = new ChartSerie(YDataRendering.YColor.SeaGreen);
        this._Graph_series3 = new ChartSerie(YDataRendering.YColor.Gold);
        this._Graph_showRecordedData = false;
        this._Graph_borderColor = YDataRendering.YColor.LightGray;
        this._Graph_borderThickness = 1.0;
        this._Graph_bgColor1 = YDataRendering.YColor.FromArgb(255, 220, 220, 220);
        this._Graph_bgColor2 = YDataRendering.YColor.FromArgb(55, 240, 240, 240);
        this._Graph_resizeRule = YDataRendering.Proportional.ResizeRule.FIXED;
        this._Graph_xAxis = new XaxisDescription();
        this._Graph_yAxes0 = new YaxisDescription(0, true);
        this._Graph_yAxes1 = new YaxisDescription(1, false);
        this._Graph_yAxes2 = new YaxisDescription(2, false);
        this._Graph_legendPanel = new LegendPanelDescription();
        this._Graph_dataTracker = new DataTrackerDescription();
        this._Graph_navigator = new NavigatorDescription();
        this._annotationPanels0 = new AnnotationPanelDescriptionGraph();
        this._annotationPanels1 = new AnnotationPanelDescriptionGraph();
        this.initFromXmlData(initData);
    }
    IsDataSourceAssigned() {
        let propList = Object.getOwnPropertyNames(this);
        propList.forEach((name) => {
            if (name.startsWith("Graphs_series")) {
                let s = this[name].GetValue(this, null);
                if (!(s.DataSource_source instanceof YoctoVisualization.NullYSensor))
                    return true;
            }
        });
        return false;
    }
    get ATTR_Graph_series0__DisplayName() { return "Series 1"; }
    get ATTR_Graph_series0__CategoryAttribute() { return "Data Sources"; }
    get ATTR_Graph_series0__PreExpandedCategoryAttribute() { return true; }
    get ATTR_Graph_series0__PreExpandedAttribute() { return true; }
    get ATTR_Graph_series0__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_series0__DescriptionAttribute() { return "First data series, expand for more."; }
    get Graph_series0() { return this._Graph_series0; }
    set Graph_series0(value) { this._Graph_series1 = value; }
    get ATTR_Graph_series1__DisplayName() { return "Series 2"; }
    get ATTR_Graph_series1__CategoryAttribute() { return "Data Sources"; }
    get ATTR_Graph_series1__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_series1__DescriptionAttribute() { return "Second data series, expand for more."; }
    get Graph_series1() { return this._Graph_series1; }
    set Graph_series1(value) { this._Graph_series1 = value; }
    get ATTR_Graph_series2__DisplayName() { return "Series 3"; }
    get ATTR_Graph_series2__CategoryAttribute() { return "Data Sources"; }
    get ATTR_Graph_series2__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_series2__DescriptionAttribute() { return "Third data series, expand for more."; }
    get Graph_series2() { return this._Graph_series2; }
    set Graph_series2(value) { this._Graph_series2 = value; }
    get ATTR_Graph_series3__DisplayName() { return "Series 4"; }
    get ATTR_Graph_series3__CategoryAttribute() { return "Data Sources"; }
    get ATTR_Graph_series3__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_series3__DescriptionAttribute() { return "Fourth data series, expand for more."; }
    get Graph_series3() { return this._Graph_series3; }
    set Graph_series3(value) { this._Graph_series3 = value; }
    get ATTR_Graph_showRecordedData__DisplayName() { return "Use datalogger data"; }
    get ATTR_Graph_showRecordedData__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_showRecordedData__CopyToTarget() { return false; } // this extra property doesn't exist is graph
    get ATTR_Graph_showRecordedData__DescriptionAttribute() { return "Makes the graph load the sensors datalogger contents. After disabling this feature, you may want to reset the dataview with the right-click context menu."; }
    get Graph_showRecordedData() { return this._Graph_showRecordedData; }
    set Graph_showRecordedData(value) {
        if (this._Graph_showRecordedData != value) {
            this._Graph_showRecordedData = value;
            if (this.ownerForm != null) {
                this.ownerForm.showRecordedDatachanged();
            }
        }
    }
    get ATTR_Graph_borderColor__DisplayName() { return "Border color"; }
    get ATTR_Graph_borderColor__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_borderColor__DescriptionAttribute() { return "Canvas borders color."; }
    get Graph_borderColor() { return this._Graph_borderColor; }
    set Graph_borderColor(value) { this._Graph_borderColor = value; }
    get ATTR_Graph_borderThickness__DisplayName() { return "Border thickness"; }
    get ATTR_Graph_borderThickness__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_borderThickness__DescriptionAttribute() { return "Canvas borders thickness."; }
    get Graph_borderThickness() { return this._Graph_borderThickness; }
    set Graph_borderThickness(value) { this._Graph_borderThickness = value; }
    get ATTR_Graph_bgColor1__DisplayName() { return "Background color 1"; }
    get ATTR_Graph_bgColor1__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_bgColor1__DescriptionAttribute() { return "Background gradient color 1."; }
    get Graph_bgColor1() { return this._Graph_bgColor1; }
    set Graph_bgColor1(value) { this._Graph_bgColor1 = value; }
    get ATTR_Graph_bgColor2__DisplayName() { return "Background color 2"; }
    get ATTR_Graph_bgColor2__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_bgColor2__DescriptionAttribute() { return "Background gradient color 2."; }
    get Graph_bgColor2() { return this._Graph_bgColor2; }
    set Graph_bgColor2(value) { this._Graph_bgColor2 = value; }
    get ATTR_Graph_resizeRule__DisplayName() { return "Font sizes"; }
    get ATTR_Graph_resizeRule__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_resizeRule__DescriptionAttribute() { return "Are font sizes fixed or do they change when window is resized?"; }
    get Graph_resizeRule() { return this._Graph_resizeRule; }
    set Graph_resizeRule(value) { this._Graph_resizeRule = value; }
    get ATTR_Graph_xAxis__DisplayName() { return "X Axis"; }
    get ATTR_Graph_xAxis__CategoryAttribute() { return "X/Y Axes"; }
    get ATTR_Graph_xAxis__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_xAxis__DescriptionAttribute() { return "X-Axis, expand for more"; }
    get Graph_xAxis() { return this._Graph_xAxis; }
    set Graph_xAxis(value) { this._Graph_xAxis = value; }
    get ATTR_Graph_yAxes0__DisplayName() { return "YAxis 1"; }
    get ATTR_Graph_yAxes0__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_yAxes0__CategoryAttribute() { return "X/Y Axes"; }
    get ATTR_Graph_yAxes0__DescriptionAttribute() { return "First Y Axis, expand for more."; }
    get Graph_yAxes0() { return this._Graph_yAxes0; }
    set Graph_yAxes0(value) { this._Graph_yAxes0 = value; }
    get ATTR_Graph_yAxes1__DisplayName() { return "YAxis 2"; }
    get ATTR_Graph_yAxes1__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_yAxes1__CategoryAttribute() { return "X/Y Axes"; }
    get ATTR_Graph_yAxes1__DescriptionAttribute() { return "Second Y Axis, expand for more."; }
    get Graph_yAxes1() { return this._Graph_yAxes1; }
    set Graph_yAxes1(value) { this._Graph_yAxes1 = value; }
    get ATTR_Graph_yAxes2__DisplayName() { return "YAxis 3"; }
    get ATTR_Graph_yAxes2__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_yAxes2__CategoryAttribute() { return "X/Y Axes"; }
    get ATTR_Graph_yAxes2__DescriptionAttribute() { return "Third Y Axis, expand for more."; }
    get Graph_yAxes2() { return this._Graph_yAxes2; }
    set Graph_yAxes2(value) { this._Graph_yAxes2 = value; }
    get ATTR_Graph_legendPanel__DisplayName() { return "Legend Panel"; }
    get ATTR_Graph_legendPanel__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_legendPanel__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_legendPanel__DescriptionAttribute() { return "Panel containing a description of all data series. Expand for more."; }
    get Graph_legendPanel() { return this._Graph_legendPanel; }
    set Graph_legendPanel(value) { this._Graph_legendPanel = value; }
    get ATTR_Graph_dataTracker__DisplayName() { return "Data tracker"; }
    get ATTR_Graph_dataTracker__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_dataTracker__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_dataTracker__DescriptionAttribute() { return "Show dynamic value labels while the mouse is moving over the graph. Expand for more."; }
    get Graph_dataTracker() { return this._Graph_dataTracker; }
    set Graph_dataTracker(value) { this._Graph_dataTracker = value; }
    get ATTR_Graph_navigator__DisplayName() { return "Navigator"; }
    get ATTR_Graph_navigator__CategoryAttribute() { return "Graph"; }
    get ATTR_Graph_navigator__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_navigator__DescriptionAttribute() { return "Small additional graph showing the whole data set and allowing to quickly navigate among data. Expand for more."; }
    get Graph_navigator() { return this._Graph_navigator; }
    set Graph_navigator(value) { this._Graph_navigator = value; }
    get ATTR_Graph_annotationPanels0__DisplayName() { return "Annotation 1"; }
    get ATTR_Graph_annotationPanels0__CategoryAttribute() { return "Annotations"; }
    get ATTR_Graph_annotationPanels0__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_annotationPanels0__DescriptionAttribute() { return "Customizable text panel 1"; }
    get Graph_annotationPanels0() { return this._annotationPanels0; }
    set Graph_annotationPanels0(value) { this._annotationPanels0 = value; }
    get ATTR_Graph_annotationPanels1__DisplayName() { return "Annotation 2"; }
    get ATTR_Graph_annotationPanels1__CategoryAttribute() { return "Annotations"; }
    get ATTR_Graph_annotationPanels1__ReadOnlyAttribute() { return true; }
    get ATTR_Graph_annotationPanels1__DescriptionAttribute() { return "Customizable text panel 2"; }
    get Graph_annotationPanels1() { return this._annotationPanels1; }
    set Graph_annotationPanels1(value) { this._annotationPanels1 = value; }
}

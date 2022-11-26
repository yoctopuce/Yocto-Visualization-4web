/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Color chooser UI
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
//class ColorEditorTab
//{
//    private _td: HTMLTableCellElement;
//    private _editor: colorEditor;
//    private _realTab: boolean = false;
//    private _div: HTMLDivElement | null = null;
//    private _tabLabel: HTMLAnchorElement | null = null;
//
//    constructor(editor: colorEditor, label: string, fontSize: number)
//    {
//        this._td = document.createElement("TD") as HTMLTableCellElement;
//        this._editor = editor;
//        if (label != "")
//        {
//            this._div = document.createElement("DIV") as HTMLDivElement;
//            this._div.style.display = "none";
//
//            this._td.style.paddingTop = "4px";
//            this._td.style.fontSize = fontSize.toString() + "px";
//            this._td.style.paddingBottom = "2px";
//
//            this._td.style.borderLeft = "1px solid " + this._editor.inactiveBorderColor;
//            this._td.style.borderRight = "1px solid " + this._editor.inactiveBorderColor;
//            this._td.style.borderTop = "1px solid " + this._editor.inactiveBorderColor;
//            this._td.style.borderBottom = "1px solid " + this._editor.activeBorderColor;
//            this._td.style.color = this._editor.inactiveColor;
//            this._td.style.backgroundColor = this._editor.inactiveBackgroundColor;
//            this._td.style.borderTopLeftRadius = "3px"
//            this._td.style.borderTopRightRadius = "3px"
//            this._td.style.paddingLeft = "5px"
//            this._td.style.paddingRight = "5px"
//            this._realTab = true;
//            this._tabLabel = document.createElement("ANCHOR") as HTMLAnchorElement;
//            this._tabLabel.innerText = label;
//            this._tabLabel.addEventListener("click", () => {this._editor.tabSelected(this)})
//            this._tabLabel.addEventListener('keyup', (e) =>
//            {
//                if ((e.key === "Enter") || (e.key === " ")) this._editor.tabSelected(this)
//            });
//            this._tabLabel.style.cursor = "pointer";
//            this._td.appendChild(this._tabLabel)
//        }
//        else
//        {
//            this._td.style.borderBottom = "1px solid " + this._editor.activeBorderColor;
//            this._td.innerHTML = "<span>&nbsp;</span>";
//        }
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
//        this._td.style.borderLeftColor = value ? this._editor.activeBorderColor : this._editor.inactiveBorderColor;
//        this._td.style.borderTopColor = value ? this._editor.activeBorderColor : this._editor.inactiveBorderColor;
//        this._td.style.borderRightColor = value ? this._editor.activeBorderColor : this._editor.inactiveBorderColor;
//        this._td.style.borderBottomColor = value ? "rgba(0, 0, 0, 0)" : this._editor.activeBorderColor;
//        this._td.style.color = value ? this._editor.activeColor : this._editor.inactiveColor;
//        this._td.style.backgroundColor = value ? this._editor.activeBackgroundColor : this._editor.inactiveBackgroundColor;
//        (<HTMLDivElement>this._div).style.display = value ? "" : "none";
//
//    }
//    public get active(): boolean {return (<HTMLDivElement>this._div).style.display == ""}
//    public get tabElement(): HTMLTableCellElement {return this._td}
//    public get divElement(): HTMLDivElement {return (<HTMLDivElement>this._div)}
//}
//
//interface ComputeBgColor {(source: ColorEditorSroll): string[]}
//
//interface scrollValueChanged {(source: ColorEditorSroll): void}
//
//interface sampleSelected {(color: YDataRendering.YColor): void}
//
//export class ColorEditorSroll
//{
//    private _div: HTMLDivElement
//    private _input: HTMLInputElement
//    private _canvasBg: HTMLCanvasElement;
//    private _canvasCursor: HTMLCanvasElement;
//    private _anchor: HTMLAnchorElement;
//    private _value: number = 0;
//    private _colorCallback: ComputeBgColor;
//    private _changeCallBack: scrollValueChanged
//    public static readonly scrollHeight: number = 26 * YoctoVisualization.constants.guiDPIFactor;
//
//    public setTabIndex(index: number): number
//    {
//        this._anchor.tabIndex = index++;
//        this._input.tabIndex = index++;
//        return index;
//    }
//
//    constructor(div: HTMLDivElement, anchor: HTMLAnchorElement, input: HTMLInputElement, colorCallback: ComputeBgColor, changeCallBack: scrollValueChanged, checkerBoardBg: boolean, value: number)
//    {
//        this._colorCallback = colorCallback;
//        this._changeCallBack = changeCallBack;
//        this._value = value;
//        this._div = div;
//        let s: number = ColorEditorSroll.scrollHeight;
//        if (checkerBoardBg) this._div.style.background = "url('data:image/svg+xml;utf8," + ColorSampler.checkerboardImage(s, s) + "')";
//        this._anchor = anchor;
//        this._input = input;
//        this._input.size = 3;
//
//        this._input.maxLength = 3;
//        this._input.type = "number";
//        this._input.min = "0";
//        this._input.max = "255";
//        this._input.style.fontSize = (12 * YoctoVisualization.constants.guiDPIFactor).toString() + "px";
//
//        this._input.style.textAlign = "right"
//        this._input.value = this._value.toString()
//        this._input.style.marginLeft = "10px"
//        this._div.style.width = "100%"
//
//        this._div.style.position = "relative"
//        this._div.style.height = ColorEditorSroll.scrollHeight.toString() + "px"
//        this._div.style.border = "1px solid black"
//
//        this._canvasBg = document.createElement("CANVAS") as HTMLCanvasElement;
//        this._div.appendChild(this._canvasBg);
//        // this._canvasBg.style.position ="absolute";
//        this._canvasBg.style.left = "0px";
//        this._canvasBg.style.top = "0px";
//        this._canvasBg.style.width = "100%";
//        this._canvasBg.style.height = "100%";
//        this._canvasBg.width = 256;
//        this._canvasBg.height = ColorEditorSroll.scrollHeight;
//
//        this._canvasCursor = document.createElement("CANVAS") as HTMLCanvasElement;
//        this._div.appendChild(this._canvasCursor);
//        this._canvasCursor.style.position = "absolute";
//
//        this._canvasCursor.style.width = "100%"
//        this._canvasCursor.style.height = "100%"
//        this._canvasCursor.style.left = "0px"
//        this._canvasCursor.style.top = "0px"
//        this._canvasCursor.style.display = "block";
//
//        this._div.addEventListener("mousedown", (e: MouseEvent) => {this.MouseDown(this._div, e)});
//        this._div.addEventListener("mousemove", (e: MouseEvent) => {this.MouseMove(this._div, e)});
//
//        // coulor sliders are way too small for multi-touch drag.
//        // this._div.addEventListener("touchstart",(e:TouchEvent) => {this.TouchStart(this._div, e)});
//        // document.addEventListener("touchmove", (e:TouchEvent)=>{ this.TouchCaptureRun(this._div,e);});
//        // document.addEventListener("touchend", (e:TouchEvent)=>{ this.TouchCaptureRun(this._div,e);});
//
//        this._anchor.addEventListener("wheel", (e: WheelEvent) => {this.mouseWheelEvent(this._div, e)});
//        this._anchor.addEventListener("keydown", (e: KeyboardEvent) => {this.KeyDown(this._div, e)});
//        this._input.addEventListener("keyup", (e: KeyboardEvent) => {this.inputKeyUp()});
//        this._input.addEventListener("change", (e: Event) => {this.inputKeyUp()});
//        this._anchor.tabIndex = 4;
//
//    }
//
//    public get value(): number {return this._value;}
//
//    public set value(v: number)
//    {
//        if (v < 0) v = 0;
//        if (v > 255) v = 255;
//        this._value = v;
//        this._input.value = this._value.toString()
//    }
//
//    private inputKeyUp()
//    {
//        let value: number = parseInt(this._input.value);
//        if (isNaN(value)) return;
//
//        if (value < 0) value = 0;
//        if (value > 255) value = 255;
//        this._value = value;
//        this.refresh();
//        this._changeCallBack(this);
//    }
//
//    private TouchStart(div: HTMLDivElement, e: TouchEvent)
//    {
//        if (e.touches.length == 1) this.handleMouseStartCapture(div, e.touches[0].clientX, e.touches[0].clientY)
//
//    }
//
//    private TouchCaptureRun(div: HTMLDivElement, e: TouchEvent)
//    {
//        if (e.touches.length == 1) this.handleMouseRun(div, e.touches[0].clientX, e.touches[0].clientY)
//    }
//
//    private TouchCaptureEnd(div: HTMLDivElement, e: TouchEvent)
//    {
//
//    }
//
//    private MouseDown(sender: HTMLDivElement, e: MouseEvent): void
//    {
//        if (e.buttons != 1) return;
//        this.handleMouseStartCapture(sender, e.clientX, e.clientY)
//    }
//
//    private handleMouseStartCapture(sender: HTMLDivElement, x: number, y: number)
//    {
//        let SenderRect: ClientRect = sender.getBoundingClientRect();
//        let eX: number = Math.round(x - SenderRect.left);
//        let index = Math.round(256 * eX / this._div.offsetWidth) >> 0;
//        if (index < 0) index = 0;
//        if (index > 255) index = 255;
//        this._value = index;
//        this._input.value = index.toString();
//        this.refresh();
//        this._changeCallBack(this);
//    }
//
//    private MouseMove(sender: HTMLDivElement, e: MouseEvent): void
//    {
//        if (e.buttons != 1) return;
//        this.handleMouseRun(sender, e.clientX, e.clientY)
//    }
//
//    private handleMouseRun(sender: HTMLDivElement, x: number, y: number)
//    {
//        let SenderRect: ClientRect = sender.getBoundingClientRect();
//        let eX: number = Math.round(x - SenderRect.left);
//        let index = Math.round(256 * eX / this._div.offsetWidth) >> 0;
//        if (index < 0) index = 0;
//        if (index > 255) index = 255;
//        this._value = index;
//        this._input.value = index.toString();
//        this.refresh();
//        this._changeCallBack(this);
//    }
//
//    public mouseWheelEvent(sender: HTMLDivElement, e: WheelEvent): void
//    {
//        this._value += e.deltaY > 0 ? -1 : 1;
//        if (this._value < 0)
//        {
//            this._value = 0;
//        }
//        else if (this._value > 255)
//        {
//            this._value = 255;
//        }
//        else
//        { e.preventDefault();}
//        this._input.value = this._value.toString();
//        this.refresh();
//        this._changeCallBack(this);
//    }
//
//    private KeyDown(sender: object, e: KeyboardEvent): void
//    {
//        if (e.code == "ArrowRight")
//        {
//            this._value++;
//            if (this._value > 255) this._value = 255;
//        }
//        if (e.code == "ArrowLeft")
//        {
//            this._value--;
//            if (this._value < 0) this._value = 0;
//        }
//        this._input.value = this._value.toString();
//        this.refresh();
//        this._changeCallBack(this);
//
//    }
//
//    public refresh(): void
//    {
//        let color: string[] = this._colorCallback(this)
//        let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>this._canvasBg.getContext('2d');
//        ctx.clearRect(0, 0, this._canvasBg.width, this._canvasBg.height)
//        for (let i: number = 0; i < 256; i++)
//        {
//            ctx.beginPath();
//            ctx.moveTo(i + 0.5, 0);
//            ctx.lineTo(i + 0.5, ColorEditorSroll.scrollHeight);
//            ctx.strokeStyle = color[i];
//            ctx.stroke();
//        }
//
//        this._canvasCursor.width = this._div.offsetWidth;
//        this._canvasCursor.height = this._div.offsetHeight;
//
//        ctx = <CanvasRenderingContext2D>this._canvasCursor.getContext('2d');
//        let x: number = 0.5 + (this._value / 255.0) * this._canvasCursor.width;
//        ctx.beginPath();
//        let y: number = 0.5;
//        ctx.moveTo(x, y + 5);
//        ctx.lineTo(x + 3, y);
//        ctx.lineTo(x - 3, y);
//        ctx.fillStyle = "black";
//        ctx.strokeStyle = "white";
//        ctx.closePath();
//        ctx.fill();
//        ctx.stroke();
//
//        y = this._canvasCursor.height - 0.5;
//        ctx.beginPath();
//        ctx.moveTo(x, y - 5);
//        ctx.lineTo(x + 3, y);
//        ctx.lineTo(x - 3, y);
//        ctx.fillStyle = "black";
//        ctx.strokeStyle = "white";
//        ctx.closePath();
//        ctx.fill();
//        ctx.stroke();
//
//    }
//}
//
//export class ColorSampler
//{
//    private _containerDiv: HTMLDivElement;
//    private _colorDiv: HTMLDivElement;
//    private _color: YDataRendering.YColor;
//    private _selectCallback: sampleSelected | null;
//
//    public setTabIndex(index: number): number
//    {
//        this._colorDiv.tabIndex = index++;
//        return index;
//    }
//
//    public static checkerboardImage(width: number, height: number): string
//    {
//        let halfWidth: number = width >> 1;
//        let halfHeight: number = height >> 1;
//
//        return '<svg xmlns="http://www.w3.org/2000/svg"   viewbox="0 0 ' + width + ' ' + height + '" width="' + width + 'px"  height="' + height + 'px" >'
//            + '<rect x="0" y="0" width="' + width + '" height="' + height + '" style="fill:white"/>'
//            + '<rect x="0" y="0" width="' + halfWidth + '" height="' + halfHeight + '" style="fill:black"/>'
//            + '<rect x="' + halfWidth + '" y="' + halfHeight + '" width="' + halfWidth + '" height="' + halfHeight + '" style="fill:black"/>'
//            + "</svg>";
//    }
//
//    constructor(containerDiv: HTMLDivElement, selectCallback: sampleSelected | null)
//    {
//        this._containerDiv = containerDiv;
//        this._selectCallback = selectCallback;
//        this._containerDiv.style.border = "1px solid grey";
//        this._containerDiv.style.background = "url('data:image/svg+xml;utf8," + ColorSampler.checkerboardImage(100, 100) + "')";
//
//        this._containerDiv.style.backgroundSize = "cover"
//        this._containerDiv.style.backgroundPosition = "center"
//        this._containerDiv.style.backgroundRepeat = "no-repeat"
//
//        this._color = YDataRendering.YColor.Transparent;
//        this._colorDiv = document.createElement("DIV") as HTMLDivElement;
//        this._colorDiv.style.display = "display-block"
//        this._colorDiv.style.position = "relative"
//        this._colorDiv.style.width = "100%"
//        this._colorDiv.style.height = "100%"
//        this._colorDiv.style.backgroundColor = "rgba(0,0,0,0)";
//        this._containerDiv.appendChild(this._colorDiv);
//
//        if (this._selectCallback != null)
//        {
//            this._colorDiv.addEventListener("click", () => {(<sampleSelected>this._selectCallback)(this.color)});
//            this._colorDiv.addEventListener('keyup', (e) => {if ((e.key === "Enter") || (e.key === " ")) (<sampleSelected>this._selectCallback)(this.color)});
//            this._colorDiv.style.cursor = "pointer";
//        }
//    }
//
//    public set color(value: YDataRendering.YColor)
//    {
//        this._color = value.clone();
//        this._colorDiv.style.backgroundColor = this._color.htmlCode;
//    }
//
//    public get color(): YDataRendering.YColor
//    { return this._color.clone()}
//
//}
//
//export class colorEditor
//{
//    static _colorHistory: YDataRendering.YColor[] = colorEditor.defaultColorHistory()
//    static _editorsList: colorEditor[] = []
//
//    private _container: HTMLDivElement;
//    private _table: HTMLTableElement;
//    private _tr1: HTMLTableRowElement
//    private _firstTabIndex: number = 0;
//    private _tr2: HTMLTableRowElement;
//    private _tabRGB: ColorEditorTab;
//    private _tabHSL: ColorEditorTab;
//    private _tabPredef: ColorEditorTab;
//    private _tabStub: ColorEditorTab;
//    private _contents: HTMLTableCellElement;
//    private _rgb_R_editor: ColorEditorSroll;
//    private _rgb_G_editor: ColorEditorSroll;
//    private _rgb_B_editor: ColorEditorSroll;
//    private _rgb_T_editor: ColorEditorSroll;
//    private _hsl_H_editor: ColorEditorSroll;
//    private _hsl_S_editor: ColorEditorSroll;
//    private _hsl_L_editor: ColorEditorSroll;
//    private _hsl_T_editor: ColorEditorSroll;
//    private _samples: ColorSampler[];
//    private _preview: ColorSampler;
//    private _prefedDivs: HTMLDivElement[];
//    private _colorChangeCallback: sampleSelected;
//    private _memorizeTimer: ReturnType<typeof setTimeout> | null = null;
//
//    public static AddColorToHistory(c: YDataRendering.YColor)
//    {
//        for (let i: number = 0; i < colorEditor._colorHistory.length; i++)
//        {
//            if (c.equal(colorEditor._colorHistory[i])) return;
//        }
//        colorEditor._colorHistory.splice(colorEditor._colorHistory.length - 1, 1);
//        colorEditor._colorHistory.splice(0, 0, c);
//
//        for (let i = colorEditor._editorsList.length - 1; i >= 0; i--)
//        {
//            colorEditor._editorsList[i].refreshColorHistory();
//        }
//    }
//
//    public static get colorHistory(): YDataRendering.YColor[]
//    {return colorEditor._colorHistory}
//
//    public get activeBorderColor(): string { return "#767676";}
//    public get inactiveBorderColor(): string { return "#b0b0b0";}
//
//    public get activeColor(): string { return "black";}
//    public get inactiveColor(): string { return "grey";}
//
//    public get activeBackgroundColor(): string { return "white";}
//    public get inactiveBackgroundColor(): string { return "#f8f8f8";}
//
//    public tabSelected(source: ColorEditorTab)
//    {
//        if (source == this._tabRGB)
//        {
//            this._tabRGB.active = true;
//            this._rgb_R_editor.refresh();
//            this._rgb_G_editor.refresh();
//            this._rgb_B_editor.refresh();
//            this._rgb_T_editor.refresh();
//
//        }
//        else
//        {
//            this._tabRGB.active = false;
//        }
//
//        if (source == this._tabHSL)
//        {
//            this._tabHSL.active = true;
//            this._hsl_H_editor.refresh();
//            this._hsl_S_editor.refresh();
//            this._hsl_L_editor.refresh();
//            this._hsl_T_editor.refresh();
//
//        }
//        else
//        {
//            this._tabHSL.active = false;
//        }
//
//        this._tabPredef.active = source == this._tabPredef;
//
//    }
//
//    public HueScrollBg()
//    {
//        let s: number = 100; //(100*this._hsl_S_editor.value/255.0);
//        let l: number = 50; //(100*this._hsl_L_editor.value/255.0);
//        let t: number = this._hsl_T_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "hsl(" + (360 * i / 256.0).toString() + "," + s.toString() + "%," + l.toString() + "%)"
//        }
//        return res;
//    }
//
//    public SaturationScrollBg()
//    {
//        let h: number = 360 * this._hsl_H_editor.value / 256.0;
//        let l: number = 100 * this._hsl_L_editor.value / 255.0;
//        let t: number = this._hsl_T_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "hsl(" + h.toString() + "," + (100 * i / 255.0).toString() + "%," + l.toString() + "%)"
//        }
//        return res;
//    }
//
//    public LuminosityScrollBg()
//    {
//        let h: number = 360 * this._hsl_H_editor.value / 256.0;
//        let s: number = 100 * this._hsl_S_editor.value / 255.0;
//        let t: number = this._hsl_T_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "hsl(" + h.toString() + "," + s.toString() + "%," + (100 * i / 255.0).toString() + "%)"
//        }
//        return res;
//    }
//
//    public HSLTranspScrollBg()
//    {
//
//        let h: number = 360 * this._hsl_H_editor.value / 256;
//        let s: number = 100 * this._hsl_S_editor.value / 255.0;
//        let l: number = 100 * this._hsl_L_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "hsla(" + h.toString() + "," + l.toString() + "%," + s.toString() + "%," + (i / 255.0).toString() + ")"
//        }
//        return res;
//
//    }
//
//    public RedScrollBg()
//    {
//        let g: number = this._rgb_G_editor.value;
//        let b: number = this._rgb_B_editor.value;
//        let t: number = this._rgb_T_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "rgb(" + i.toString() + "," + g.toString() + "," + b.toString() + ")"
//        }
//        return res;
//    }
//
//    public GreenScrollBg()
//    {
//        let r: number = this._rgb_R_editor.value;
//        let b: number = this._rgb_B_editor.value;
//        let t: number = this._rgb_T_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "rgb(" + r.toString() + "," + i.toString() + "," + b.toString() + ")"
//        }
//        return res;
//    }
//
//    public BlueScrollBg()
//    {
//        let r: number = this._rgb_R_editor.value;
//        let g: number = this._rgb_G_editor.value;
//        let t: number = this._rgb_T_editor.value / 255.0;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "rgb(" + r.toString() + "," + g.toString() + "," + i.toString() + ")"
//        }
//        return res;
//    }
//
//    public RGBTranspScrollBg()
//    {
//
//        let r: number = this._rgb_R_editor.value;
//        let g: number = this._rgb_G_editor.value;
//        let b: number = this._rgb_B_editor.value;
//        let res: string[] = new Array(256);
//        for (let i = 0; i < 256; i++)
//        {
//            res [i] = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + (i / 255.0).toString() + ")"
//        }
//        return res;
//
//    }
//
//    private static defaultColorHistory(): YDataRendering.YColor[]
//    {
//        let defaultHistory: YDataRendering.YColor[] = [];
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 0));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 51));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 102));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 153));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 204));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 255));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 42, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 85, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 96, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 127, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 170, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 192, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 212, 255, 127));
//        defaultHistory.push(YDataRendering.YColor.FromAhsl(255, 226, 217, 214));
//        return defaultHistory
//
//    }
//
//    public destroy()
//    {
//        for (let i = colorEditor._editorsList.length - 1; i >= 0; i--)
//        {
//            if (colorEditor._editorsList[i] == this)
//            {
//                colorEditor._editorsList.splice(i, 1)
//            }
//        }
//    }
//
//    public refreshColorHistory()
//    {
//        for (let i: number = 0; i < this._samples.length; i++)
//        {
//            if (i < colorEditor._colorHistory.length)
//            {
//                this._samples[i].color = colorEditor._colorHistory[i].clone();
//            }
//        }
//    }
//
//    public constructor(container: HTMLDivElement, fontSize: number, initialColor: YDataRendering.YColor, colorChangeCallback: sampleSelected)
//    {
//        colorEditor._editorsList.push(this)
//        this._colorChangeCallback = colorChangeCallback;
//        this._container = container;
//        this._table = document.createElement("TABLE") as HTMLTableElement;
//
//        this._table.style.width = "100%"
//
//        this._table.style.borderSpacing = "0";
//        this._table.style.paddingLeft = "5px";
//        this._table.style.paddingTop = "5px";
//        this._table.style.paddingRight = "5px";
//        this._table.style.borderCollapse = "separate";
//        this._tr1 = document.createElement("TR") as HTMLTableRowElement;
//        this._tr2 = document.createElement("TR") as HTMLTableRowElement;
//        this._tabRGB = new ColorEditorTab(this, "RGB", fontSize);
//        this._tabHSL = new ColorEditorTab(this, "HSL", fontSize);
//        this._tabPredef = new ColorEditorTab(this, "Predefined", fontSize);
//        this._tabStub = new ColorEditorTab(this, "", fontSize);
//
//        this._contents = document.createElement("TD") as HTMLTableCellElement;
//        this._contents.colSpan = 4;
//        this._contents.style.borderLeft = "1px solid " + this.activeBorderColor
//        this._contents.style.borderRight = "1px solid " + this.activeBorderColor
//        this._contents.style.borderBottom = "1px solid " + this.activeBorderColor
//        this._contents.style.backgroundColor = this.activeBackgroundColor;
//
//        this._tr1.appendChild(this._tabRGB.tabElement);
//        this._tr1.appendChild(this._tabHSL.tabElement);
//        this._tr1.appendChild(this._tabPredef.tabElement);
//        this._tr1.appendChild(this._tabStub.tabElement);
//        this._tr2.appendChild(this._contents);
//
//        this._table.appendChild(this._tr1);
//        this._table.appendChild(this._tr2);
//
//        this._contents.appendChild(this._tabRGB.divElement)
//        this._contents.appendChild(this._tabHSL.divElement)
//        this._contents.appendChild(this._tabPredef.divElement)
//
//        let RGBtable: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//        RGBtable.style.width = "100%"
//        RGBtable.style.borderSpacing = "1";
//        this._tabRGB.divElement.appendChild(RGBtable);
//
//        let HSLtable: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//        HSLtable.style.width = "100%"
//        HSLtable.style.borderSpacing = "1";
//        this._tabHSL.divElement.appendChild(HSLtable);
//
//        let predefTable: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//
//        this._tabPredef.divElement.appendChild(predefTable);
//        predefTable.style.width = "100%"
//        predefTable.style.borderSpacing = "1";
//        predefTable.style.tableLayout = "fixed";
//
//        this._container.appendChild(this._table);
//
//        this._rgb_R_editor = this.AddColorScroll(RGBtable, "R", () => { return this.RedScrollBg();}, (src: ColorEditorSroll) => {this.RgbColorChangeCallBack(src);}, false, 1);
//        this._rgb_G_editor = this.AddColorScroll(RGBtable, "G", () => { return this.GreenScrollBg();}, (src: ColorEditorSroll) => {this.RgbColorChangeCallBack(src);}, false, 2);
//        this._rgb_B_editor = this.AddColorScroll(RGBtable, "B", () => { return this.BlueScrollBg();}, (src: ColorEditorSroll) => {this.RgbColorChangeCallBack(src);}, false, 3);
//        this._rgb_T_editor = this.AddColorScroll(RGBtable, "T", () => { return this.RGBTranspScrollBg();}, (src: ColorEditorSroll) => {this.RgbColorChangeCallBack(src);}, true, 3);
//        this._rgb_R_editor.value = initialColor.red;
//        this._rgb_G_editor.value = initialColor.green;
//        this._rgb_B_editor.value = initialColor.blue;
//        this._rgb_T_editor.value = initialColor.alpha;
//        this._rgb_R_editor.refresh();
//        this._rgb_G_editor.refresh();
//        this._rgb_B_editor.refresh();
//        this._rgb_T_editor.refresh();
//
//        this._hsl_H_editor = this.AddColorScroll(HSLtable, "H", () => { return this.HueScrollBg();}, (src: ColorEditorSroll) => {this.HslColorChangeCallBack(src);}, false, 1);
//        this._hsl_S_editor = this.AddColorScroll(HSLtable, "S", () => { return this.SaturationScrollBg();}, (src: ColorEditorSroll) => {this.HslColorChangeCallBack(src);}, false, 2);
//        this._hsl_L_editor = this.AddColorScroll(HSLtable, "L", () => { return this.LuminosityScrollBg();}, (src: ColorEditorSroll) => {this.HslColorChangeCallBack(src);}, false, 3);
//        this._hsl_T_editor = this.AddColorScroll(HSLtable, "T", () => { return this.HSLTranspScrollBg();}, (src: ColorEditorSroll) => {this.HslColorChangeCallBack(src);}, true, 3);
//        this._hsl_H_editor.value = initialColor.hue;
//        this._hsl_S_editor.value = initialColor.saturation;
//        this._hsl_L_editor.value = initialColor.luminosity;
//        this._hsl_T_editor.value = initialColor.alpha;
//        this._hsl_H_editor.refresh();
//        this._hsl_S_editor.refresh();
//        this._hsl_L_editor.refresh();
//        this._hsl_T_editor.refresh();
//
//        // construct Color samples table at to bottom of the UI
//        let samplesTable: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//        samplesTable.style.position = "relative"
//        samplesTable.style.width = "100%"
//        samplesTable.style.paddingLeft = "3px"
//        samplesTable.style.paddingRight = "3px"
//        samplesTable.style.paddingTop = "10px"
//        samplesTable.style.bottom = "3px"
//        samplesTable.style.tableLayout = "fixed";
//
//        let samplesTD: HTMLTableCellElement[] = [];
//        let previewTD: HTMLTableCellElement | null = null;
//        let sampleHeight: number = 30;
//
//        let sampletr1: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        sampletr1.style.height = sampleHeight.toString() + "px";
//        for (let i: number = 0; i < 6; i++)
//        {
//            let td: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            //td.style.border="1px solid red";
//            if (i == 5)
//            {
//                td.colSpan = 2;
//                td.rowSpan = 3;
//                previewTD = td
//            }
//            else
//            {
//                samplesTD.push(td)
//            }
//            sampletr1.appendChild(td);
//        }
//        samplesTable.appendChild(sampletr1)
//
//        let sampletr2: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        sampletr2.style.height = sampleHeight.toString() + "px";
//        for (let i: number = 0; i < 5; i++)
//        {
//            let td: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            //td.style.border="1px solid red";
//            samplesTD.push(td)
//            sampletr2.appendChild(td)
//        }
//        samplesTable.appendChild(sampletr2)
//
//        let sampletr3: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        sampletr3.style.height = sampleHeight.toString() + "px";
//        for (let i: number = 0; i < 5; i++)
//        {
//            let td: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            //td.style.border="1px solid red";
//            samplesTD.push(td)
//            sampletr3.appendChild(td)
//        }
//        samplesTable.appendChild(sampletr3)
//        this._container.appendChild(samplesTable);
//
//        this._samples = []
//        for (let i: number = 0; i < samplesTD.length; i++)
//        {
//            let div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//            div.style.position = "relative";
//            div.style.width = "100%"
//            div.style.height = (sampleHeight - 4).toString() + "px";
//            div.style.display = "inline-block"
//            div.title = "Color history"
//            samplesTD[i].appendChild(div)
//            let sampler: ColorSampler = new ColorSampler(div, (c: YDataRendering.YColor) => { this.sampleWasSelectedCallback(c); })
//            sampler.color = colorEditor._colorHistory[i]
//            this._samples.push(sampler);
//        }
//        // predefined colors
//
//        let prefinedColors: YDataRendering.YColor[] = <any>YDataRendering.YColor.predefinedColors;
//        let colors: YDataRendering.YColor[] = [];
//        let predefinedColorNames: string[] = Object.keys(prefinedColors)
//        for (let i: number = 0; i < predefinedColorNames.length; i++)
//        {
//            colors.push(prefinedColors[<any>predefinedColorNames[i]]);
//        }
//        colors.sort((c1: YDataRendering.YColor, c2: YDataRendering.YColor): number =>
//        {
//            if (c1.alpha < c2.alpha) return 1;
//            if (c1.alpha > c2.alpha) return -1;
//
//            if (c1.luminosity < c2.luminosity) return 1;
//            if (c1.luminosity > c2.luminosity) return -1;
//
//            if (c1.saturation < c2.saturation) return 1;
//            if (c1.saturation > c2.saturation) return -1;
//
//            if (c1.hue < c2.hue) return 1;
//            if (c1.hue > c2.hue) return -1;
//
//            return 0;
//        });
//
//        let currenTR: HTMLTableRowElement | null = null;
//        this._prefedDivs = [];
//        //debugger;
//        for (let i: number = 0; i < colors.length; i++)
//        {
//            let c = colors[i];
//
//            if ((i % 16) == 0)
//            {
//                currenTR = document.createElement("TR") as HTMLTableRowElement;
//                predefTable.appendChild(currenTR)
//            }
//
//            let td: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            (<HTMLTableRowElement>currenTR).appendChild(td);
//            let div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//            this._prefedDivs.push(div)
//            div.style.position = "relative";
//            div.style.width = "100%"
//            div.style.height = Math.round(10 * YoctoVisualization.constants.guiDPIFactor).toString() + "px";
//            div.style.display = "inline-block"
//            div.title = c.name;
//
//            td.appendChild(div)
//            let sampler: ColorSampler = new ColorSampler(div, (c: YDataRendering.YColor) => { this.sampleWasSelectedCallback(c); })
//            sampler.color = c;
//
//        }
//
//        // preview
//        let div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//        div.style.position = "relative";
//        div.style.width = "100%"
//        div.style.height = (3 * sampleHeight).toString() + "px";
//        div.style.display = "inline-block"
//        div.title = "Color preview";
//        (<HTMLTableCellElement>previewTD).appendChild(div)
//        this._preview = new ColorSampler(div, null);
//        this._preview.color = initialColor;
//        this.selectApropriateTab(initialColor);
//
//    }
//
//    private selectApropriateTab(color: YDataRendering.YColor)
//    {
//        if (color.isPredefined)
//        {
//            this._tabPredef.active = true;
//            this.tabSelected(this._tabPredef);
//        }
//        else
//        {
//            this._tabPredef.active = false;
//            if (color.isRGB)
//            {
//                this._tabRGB.active = true;
//                this._tabHSL.active = false;
//                this.tabSelected(this._tabRGB);
//            }
//            else
//            {
//                this._tabRGB.active = false;
//                this._tabHSL.active = true;
//                this.tabSelected(this._tabHSL);
//            }
//        }
//
//    }
//
//    private sampleWasSelectedCallback(color: YDataRendering.YColor)
//    {
//        this._rgb_R_editor.value = color.red;
//        this._rgb_G_editor.value = color.green;
//        this._rgb_B_editor.value = color.blue;
//        this._rgb_T_editor.value = color.alpha;
//
//        this._hsl_H_editor.value = color.hue;
//        this._hsl_S_editor.value = color.saturation;
//        this._hsl_L_editor.value = color.luminosity;
//        this._hsl_T_editor.value = color.alpha;
//
//        this._preview.color = color;
//        this._rgb_R_editor.refresh();
//        this._rgb_G_editor.refresh();
//        this._rgb_B_editor.refresh();
//        this._rgb_T_editor.refresh();
//        this._hsl_H_editor.refresh();
//        this._hsl_S_editor.refresh();
//        this._hsl_L_editor.refresh();
//        this._hsl_T_editor.refresh();
//        this.initColorMemorization(color)
//        if (this._colorChangeCallback != null) this._colorChangeCallback(color);
//
//    }
//
//    private initColorMemorization(color: YDataRendering.YColor)
//    {
//        if (this._memorizeTimer != null) clearTimeout(this._memorizeTimer)
//        this._memorizeTimer = setTimeout(() =>
//        {
//            this._memorizeTimer = null;
//            colorEditor.AddColorToHistory(color);
//        }, 2000);
//    }
//
//    private RgbColorChangeCallBack(src: ColorEditorSroll)
//    {
//        if (src != this._rgb_R_editor) this._rgb_R_editor.refresh();
//        if (src != this._rgb_G_editor) this._rgb_G_editor.refresh();
//        if (src != this._rgb_B_editor) this._rgb_B_editor.refresh();
//        if (src != this._rgb_T_editor) this._rgb_T_editor.refresh();
//        let color: YDataRendering.YColor = YDataRendering.YColor.FromArgb(this._rgb_T_editor.value, this._rgb_R_editor.value, this._rgb_G_editor.value, this._rgb_B_editor.value)
//        this._preview.color = color;
//        this.initColorMemorization(color)
//        if (this._colorChangeCallback != null) this._colorChangeCallback(color);
//
//    }
//
//    private HslColorChangeCallBack(src: ColorEditorSroll)
//    {
//        if (src != this._hsl_H_editor) this._hsl_H_editor.refresh();
//        if (src != this._hsl_S_editor) this._hsl_S_editor.refresh();
//        if (src != this._hsl_L_editor) this._hsl_L_editor.refresh();
//        if (src != this._hsl_T_editor) this._hsl_T_editor.refresh();
//        let color: YDataRendering.YColor = YDataRendering.YColor.FromAhsl(this._hsl_T_editor.value, this._hsl_H_editor.value, this._hsl_S_editor.value, this._hsl_L_editor.value,)
//        this._preview.color = color;
//        this.initColorMemorization(color)
//        if (this._colorChangeCallback != null) this._colorChangeCallback(color);
//
//    }
//
//    public set color(color: YDataRendering.YColor)
//    {
//        this._preview.color = color;
//        this._hsl_H_editor.value = color.hue;
//        this._hsl_S_editor.value = color.saturation;
//        this._hsl_L_editor.value = color.luminosity
//        this._hsl_T_editor.value = color.alpha;
//        this._rgb_R_editor.value = color.red;
//        this._rgb_G_editor.value = color.green;
//        this._rgb_B_editor.value = color.blue;
//        this._rgb_T_editor.value = color.alpha;
//        this._hsl_H_editor.refresh();
//        this._hsl_S_editor.refresh();
//        this._hsl_L_editor.refresh();
//        this._hsl_T_editor.refresh();
//        this._rgb_R_editor.refresh();
//        this._rgb_G_editor.refresh();
//        this._rgb_B_editor.refresh();
//        this._rgb_T_editor.refresh();
//        this.selectApropriateTab(color);
//    }
//
//    private AddColorScroll(container: HTMLTableElement, label: string, colorCallback: ComputeBgColor, changeCallBack: scrollValueChanged, checkerBoardBg: boolean, value: number): ColorEditorSroll
//    {
//        let RGB_R_Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        let RGB_R_Col1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        RGB_R_Col1.innerHTML = "&nbsp;" + label + "&nbsp;"
//        let RGB_R_Col2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        let RGB_R_Anchor: HTMLAnchorElement = document.createElement("ANCHOR") as HTMLAnchorElement;
//        RGB_R_Col2.appendChild(RGB_R_Anchor);
//        let RGB_R_Div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//        RGB_R_Col2.style.width = "100%";
//        RGB_R_Anchor.appendChild(RGB_R_Div);
//        let RGB_R_Col3: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        let RGB_R_Input: HTMLInputElement = document.createElement("INPUT") as HTMLInputElement;
//        RGB_R_Col3.appendChild(RGB_R_Input);
//        RGB_R_Row.appendChild(RGB_R_Col1);
//        RGB_R_Row.appendChild(RGB_R_Col2);
//        RGB_R_Row.appendChild(RGB_R_Col3);
//        container.appendChild(RGB_R_Row);
//        return new ColorEditorSroll(RGB_R_Div, RGB_R_Anchor, RGB_R_Input, colorCallback, changeCallBack, checkerBoardBg, value);
//
//    }
//
//    public setTabIndex(index: number): number
//    {
//        this._firstTabIndex = index;
//        index = this._tabRGB.setTabIndex(index);
//        index = this._tabHSL.setTabIndex(index);
//        index = this._tabPredef.setTabIndex(index);
//
//        if (this._tabRGB.active)
//        {
//            index = this._rgb_R_editor.setTabIndex(index);
//            index = this._rgb_G_editor.setTabIndex(index);
//            index = this._rgb_B_editor.setTabIndex(index);
//            index = this._rgb_T_editor.setTabIndex(index);
//        }
//        else if (this._tabHSL.active)
//        {
//            index = this._hsl_H_editor.setTabIndex(index);
//            index = this._hsl_S_editor.setTabIndex(index);
//            index = this._hsl_L_editor.setTabIndex(index);
//            index = this._hsl_T_editor.setTabIndex(index);
//        }
//        else
//        {
//            for (let i: number = 0; i < this._prefedDivs.length; i++)
//            { this._prefedDivs[i].tabIndex = index++; }
//        }
//
//        for (let i: number = 0; i < this._samples.length; i++)
//        {
//            index = this._samples[i].setTabIndex(index);
//        }
//
//        return index;
//
//    }
//
//}
//
////#endif

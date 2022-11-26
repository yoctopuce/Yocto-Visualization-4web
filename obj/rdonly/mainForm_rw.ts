/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Welcome window
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
//interface ButtonClick {(): void}
//
//export class mainForm
//{
//
//    private _window: YoctoVisualization.YWindow;
//    private GUIcoef: number = 1;
//    private static readonly REFWIDH: number = 500;
//    private static readonly REFHEIGHT = 360;
//
//    constructor()
//    {
//
//        let params: YoctoVisualization.newWindowParam = new YoctoVisualization.newWindowParam();
//        params.positionType = YoctoVisualization.WindowPositionType.CENTERED
//        this.GUIcoef = YoctoVisualization.constants.generalSizeCoef;
//        // ooops default size is going to be larger than screen, let adjust on the fly
//        if (mainForm.REFWIDH * this.GUIcoef > screen.width) this.GUIcoef = screen.width / mainForm.REFWIDH;
//        if (mainForm.REFHEIGHT * this.GUIcoef > screen.height) this.GUIcoef = screen.height / mainForm.REFHEIGHT;
//
//        params.width = Math.round(mainForm.REFWIDH * this.GUIcoef);
//        params.height = Math.round(mainForm.REFHEIGHT * this.GUIcoef);
//        params.showHeader = false;
//        params.showContainerBorders = false;
//        this._window = new YoctoVisualization.YWindow(params)
//        let contents: HTMLDivElement = this._window.innerContentDiv;
//
//        let title: HTMLParagraphElement = document.createElement("p") as HTMLParagraphElement;
//        title.style.paddingTop = "0px"
//        title.style.marginTop = (4 * this.GUIcoef) + "px";
//        title.style.fontSize = (16 * this.GUIcoef) + "px";
//        title.innerText = "Hello, welcome to Yocto-Visualization, what would you like to do?"
//        title.style.textAlign = "center";
//        contents.appendChild(title);
//
//        let table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//
//        table.style.position = "absolute";
//        table.style.top = "0px";
//        table.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//        table.style.tableLayout = "fixed";
//        table.style.paddingLeft = Math.round(10 * this.GUIcoef).toString() + "px";
//        table.style.paddingRight = Math.round(10 * this.GUIcoef).toString() + "px";
//        table.style.paddingTop = Math.round(30 * this.GUIcoef).toString() + "px";
//        table.style.paddingBottom = Math.round(15 * this.GUIcoef).toString() + "px";
//        table.style.width = "100%";
//        table.style.height = "100%";
//        table.style.borderSpacing = Math.round(5 * this.GUIcoef).toString() + "px";
//
//        let tr1: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        table.appendChild(tr1);
//        let td11: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        tr1.appendChild(td11)
//        let td12: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        tr1.appendChild(td12)
//        let td13: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        tr1.appendChild(td13)
//        let tr2: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        table.appendChild(tr2);
//        let td21: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        tr2.appendChild(td21)
//        let td22: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        tr2.appendChild(td22)
//        let td23: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        tr2.appendChild(td23)
//        contents.appendChild(table);
//
//        let version: HTMLParagraphElement = document.createElement("p") as HTMLParagraphElement;
//        version.style.position = "absolute"
//        version.style.right = "0px"
//        version.style.bottom = "0px"
//        version.style.marginBottom = "0px"
//        version.style.paddingBottom = "0px"
//
//        version.style.marginRight = "2px"
//        version.style.fontSize = (8 * this.GUIcoef).toString() + "px";
//        version.innerText = YoctoVisualization.constants.buildVersion;
//        version.style.color = "grey";
//        version.style.textAlign = "right";
//        contents.appendChild(version);
//        let size: string = (128 * this.GUIcoef).toString();
//        this.createButton(td11, "Configure global parameters", YoctoVisualization.ressources.ConfigureIcon(size, true, false, false, false), () => { this.openConfig()});
//        this.createButton(td12, "Create a new solid gauge", YoctoVisualization.ressources.SolidGaugeIcon(size, true, false, false, false), () => { YoctoVisualization.YWebPage.newGaugeWidget();});
//        this.createButton(td13, "Create a new graph", YoctoVisualization.ressources.GraphIcon(size, true, false, false, false), () => {YoctoVisualization.YWebPage.newGraphWidget()});
//        this.createButton(td21, "Get Raw data", YoctoVisualization.ressources.RawDataIcon(size, true, false, false, false), () => { this.openRawData()});
//        this.createButton(td22, "Create a new digital display", YoctoVisualization.ressources.DigitalDisplayIcon(size, true, false, false, false), () => { YoctoVisualization.YWebPage.newDigitalDisplayWidget()});
//        this.createButton(td23, "Create a new angular gauge", YoctoVisualization.ressources.AngularGaugeIcon(size, true, false, false, false), () => { YoctoVisualization.YWebPage.newAngularGaugeWidget()});
//
//    }
//    public hide() { this._window.hide();}
//    public show() { this._window.show();}
//
//    public createButton(container: HTMLTableCellElement, caption: string, icon: string, callback: ButtonClick): void
//    {
//        container.style.border = "1px solid black";
//        container.style.textAlign = "center";
//        container.style.fontSize = (10 * this.GUIcoef).toString() + "px";
//        container.style.paddingBottom = "3px";
//        container.style.borderColor = "#808080"
//        container.style.backgroundColor = "#f0f0f0"
//        container.style.cursor = "pointer";
//        container.addEventListener('mouseover', function () {container.style.backgroundColor = "white"})
//        container.addEventListener('mouseout', function () { container.style.backgroundColor = "#f0f0f0" })
//        let a: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
//        a.style.outline = "none";
//        a.innerHTML = icon + "<br>" + caption;
//        a.addEventListener('click', callback);
//        a.tabIndex = 0;
//        a.addEventListener("focusin", () => { container.style.backgroundColor = "white";});
//        a.addEventListener("focusout", () => { container.style.backgroundColor = "f0f0f0";});
//        a.addEventListener("keypress", (e: KeyboardEvent) => { if (e.key == "Enter") callback(); });
//        container.appendChild(a);
//
//    }
//
//    private openConfig(): void
//    {
//
//        YoctoVisualization.configForm.show()
//
//    }
//
//    private openRawData(): void { YoctoVisualization.rawDataForm.show()}
//
//
//
//
//}
//
////#endif

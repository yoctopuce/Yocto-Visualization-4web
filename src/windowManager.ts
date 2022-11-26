/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*   Application windows management
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

import * as YoctoVisualization from "./YoctoVisualizationFull.js";

export interface buttonClickCallback {(source: button): void;}

export interface confirmCallback {(userdata: object): void;}

export interface windowIsClosingCallBack {(source: YWindow): void;}

export class button
{
    private _action: buttonClickCallback;
    private _link: HTMLAnchorElement ;
    private _enabled: boolean = true;
    private _visible: boolean = true;
    private _caption: string = "";

    constructor(caption: string, action: buttonClickCallback, sizeCoefOverload?: number)
    {
        this._caption = caption;
        this._action = action;
        let GUIcoef: number = YoctoVisualization.constants.generalSizeCoef;
        if (typeof (sizeCoefOverload) !== "undefined") GUIcoef = sizeCoefOverload;
        this._link = document.createElement("A") as HTMLAnchorElement;
        this._link.innerText = this._caption;
        this._link.style.cursor = "pointer";
        this._link.style.display = "inlineblock"
        let padding: string = Math.round(5 * GUIcoef).toString() + "px"
        let margin: string = Math.round(3 * GUIcoef).toString() + "px"
        this._link.tabIndex = 0;
        this._link.style.padding = padding + " " + padding + " " + padding + " " + padding
        this._link.style.margin = margin + " " + margin + " " + margin + " " + margin
        this._link.style.borderColor = "#808080"
        this._link.style.backgroundColor = "#f0f0f0"
        this._link.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        this._link.style.fontSize = (16 * GUIcoef).toString() + "px";
        this._link.style.cursor = "pointer";
        this._link.style.border = YoctoVisualization.constants.WindowInnerBorder;
        this._link.addEventListener('mouseover', () => { if (this._enabled) this._link.style.backgroundColor = "white";})
        this._link.addEventListener('mouseout', () => { if (this._enabled) this._link.style.backgroundColor = "#f0f0f0"; })
        this._link.addEventListener('click', () => {if (this._enabled) this._action(this)});
        this._link.addEventListener('keypress', (e:KeyboardEvent) => {if ( this._enabled &&((e.key=='Enter')||(e.key==' '))) this._action(this)});

    }

    public get Element(): HTMLAnchorElement {return this._link}

    public set tabIndex(index:number)
        { this._link.tabIndex = index;
        }

    public focus()
    { this._link.focus();
    }


    public get visible(): boolean {return this._visible}
    public set visible(value: boolean)
    {
        this._visible = value;
        this._link.style.display = this._visible ? "" : "none";
    }

    public get enabled(): boolean {return this._enabled}
    public set enabled(value: boolean) { this.enable(value)}

    public performAction(): void
    {
        if (!this._enabled) return;
        this._action(this);

    }

    public showShortcut(enable: boolean)
    {
        if (!this._enabled) enable = false;
        if (enable)
        {
            this._link.innerHTML = "<u>" + this._caption.substring(0, 1) + "</u>" + this._caption.substring(1);
        }
        else
        {
            this._link.innerText = this._caption;
        }
    }

    private enable(state: boolean): void
    {
        if (state == this._enabled) return;
        this._enabled = state;
        this._link.tabIndex = state ? 0 : -1;

        if (this._enabled)
        {
            this._link.style.cursor = "pointer";
            this._link.style.backgroundColor = "#f0f0f0";
            this._link.style.color = "black";
        }
        else
        {
            this._link.style.backgroundColor = "#e0e0e0";
            this._link.style.cursor = "default";
            this._link.style.color = "#A0A0A0";
        }

    }

}

export const enum WindowPositionType {REGULAR, CENTERED, SIDEANCHORED}

export class newWindowParam
{
    public createNow: boolean = false; // force all the window UI Element to be allocated now instead of when show() is called

    public left: number = 100;
    public top: number = 100;
    public positionType: WindowPositionType = WindowPositionType.REGULAR;
    public width: number = 400;
    public height: number = 300;
    public isModal: boolean = false;
    public showShadow: boolean = true;

    public showContainerBorders: boolean = true;

    public showHeader: boolean = true;
    public title: string = "new Window"
    public closeIcon: boolean = true;
    public headerBgColor: string = ""
    public bottomKeepClear = 0;
    public contentsDefaultFontSize = YoctoVisualization.constants.generalFontSize;
    public contentsDefaultFontFamily = YoctoVisualization.constants.generalFontFamily;

    public closingCallBack: windowIsClosingCallBack | null = null;
    public WindowBackgroundColor: string = "#f0f0f0"
    public WindowBorder: string = "1px solid #808080"
    public WindowPadding: number = 2
    public WindowInnerBorderColor: string = " #A0A0A0"
    public WindowInnerBackgroundColor: string = "#fAfAfA"
    public WindowInnerBorder: string = "1px solid " + this.WindowInnerBorderColor
    public WindowHeaderBackgroundColor: string = "#0072ca"
    public WindowHeaderColor: string = "white"
    public WindowHeaderBorder: string = "1px solid #0072ca"
    private _GUICoef: number = YoctoVisualization.constants.generalSizeCoef;
    public WindowHeaderHeight: number = Math.round(20 * YoctoVisualization.constants.generalSizeCoef)
    public WindowHeaderFontSize: number = 16 * YoctoVisualization.constants.generalSizeCoef
    public WindowHeaderFontFamily = YoctoVisualization.constants.generalFontFamily
    public buttons: button[] = []

    public get GUICoef(): number
    {
        return this._GUICoef;

    }

    constructor(sizeCoefOverload?: number)
    {
        if (typeof (sizeCoefOverload) !== "undefined")
        {
            this.WindowHeaderHeight = 20 * sizeCoefOverload
            this.WindowHeaderFontSize = 16 * sizeCoefOverload
            this._GUICoef = sizeCoefOverload;
        }

    }

    public clone(): newWindowParam
    {
        let it: newWindowParam = new newWindowParam();
        let keys: string[] = Object.keys(this);
        for (let i: number = 0; i < keys.length; i++)
        {
            if (keys[i] != "buttons") (<any>it)[keys[i]] = (<any>this)[keys[i]];
        }
        for (let i: number = 0; i < this.buttons.length; i++)
        {
            it.buttons.push(this.buttons[i])
        }
        return it;
    }

}

export class YWindow
{
    private _params: newWindowParam;
    private _div: HTMLDivElement | null = null;   // main contain
    private _contents: HTMLDivElement
    private _titleSpan: HTMLSpanElement | null = null
    private _ModalDivShield: HTMLDivElement | null = null
    private _switchSideDiv: HTMLDivElement | null = null
    private _buttonsContainer: HTMLDivElement | null = null
    private static windowList: YWindow[] = [];

    public static get ConTextMenuBestZindex(): number
    {
        for (let i = 0; i < YWindow.windowList.length; i++)
        {
            if (YWindow.windowList[i].isModal()) return -1;
        }
        return 100000 + 2 * YWindow.windowList.length;

    }

    constructor(params: newWindowParam)
    {
        this._params = params.clone();
        YWindow.windowList.push(this)
        this._contents = document.createElement("DIV") as HTMLDivElement;
        if (params.createNow) this.allocate();
    }

    public get innerContentDiv(): HTMLDivElement
    { return this._contents}

    public get bottomKeepClear(): number
    { return this._params.bottomKeepClear; }

    public set bottomKeepClear(value: number)
    {
        this._params.bottomKeepClear = value;
        if (this._contents != null)
        {
            this._contents.style.bottom = (this._params.WindowPadding + this._params.bottomKeepClear).toString() + "px";
        }
    }

    public get outterContentDiv(): HTMLDivElement
    { return <HTMLDivElement>this._div}

    public isModal(): boolean
    {
        if (this._div == null) return false;
        return (this._div.style.display == "") && (this._params.isModal);
    }

    public get visible(): boolean
    {
        if (this._div == null) return false;
        return this._div.style.display == "";

    }

    public set visible(v: boolean)
    {
        v ? this.show() : this.hide();

    }

    public show(width?: number)
    {
        if (this._div == null) this.allocate();
        (<HTMLDivElement>this._div).style.display = "";
        if (this._ModalDivShield != null) this._ModalDivShield.style.display = "";
        this.brintToFront();
        if ((typeof (width) !== "undefined") && (this._params.positionType == WindowPositionType.SIDEANCHORED))
        { (<HTMLDivElement>this._div).style.width = width.toString() + "px"; }
    }

    public allocate()
    {
        if (this._div != null) return;

        if (this._params.isModal)
        {
            this._ModalDivShield = document.createElement("DIV") as HTMLDivElement;
            this._ModalDivShield.style.position = "fixed"
            this._ModalDivShield.style.left = "0px";
            this._ModalDivShield.style.top = "0px";
            this._ModalDivShield.style.right = "0px";
            this._ModalDivShield.style.bottom = "0px";
            this._ModalDivShield.style.backgroundColor = "rgba(255,255,255,0.85) ";

            document.body.appendChild(this._ModalDivShield)
        }

        this._div = document.createElement("DIV") as HTMLDivElement;
        this._div.style.display = "none"

        switch (this._params.positionType)
        {
        case WindowPositionType.REGULAR:
            this._div.style.position = "absolute"
            this._div.style.left = this._params.left.toString() + "px";
            this._div.style.top = this._params.top.toString() + "px";
            this._div.style.width = this._params.width.toString() + "px";
            this._div.style.height = this._params.height.toString() + "px";
            break;
        case WindowPositionType.CENTERED:
            this._div.style.position = "absolute"
            this._div.style.left = "50%";
            this._div.style.top = "50%";
            this._div.style.transform = "translate(-50%, -50%)";
            this._div.style.width = this._params.width.toString() + "px";
            this._div.style.height = this._params.height.toString() + "px";
            break;
        case WindowPositionType.SIDEANCHORED:
            this._div.style.position = "fixed"
            this._div.style.top = "5px";
            this._div.style.right = "5px";
            this._div.style.bottom = "5px";
            this._div.style.width = this._params.width.toString() + "px";
            break;
        }

        this._div.style.border = this._params.WindowBorder;
        this._div.style.backgroundColor = this._params.WindowBackgroundColor;
        if (this._params.showShadow) this._div.style.boxShadow = " 4px 4px 4px 1px rgba(0,0,0,0.05)";

        let containerTop: number = this._params.WindowPadding;

        if (this._params.showHeader)
        {
            containerTop = this._params.WindowHeaderHeight + 3 * this._params.WindowPadding;
            let title: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
            title.style.position = "absolute";
            title.style.left = this._params.WindowPadding.toString() + "px"
            title.style.top = this._params.WindowPadding.toString() + "px"
            title.style.right = this._params.WindowPadding.toString() + "px"
            title.style.height = this._params.WindowHeaderHeight.toString() + "px";
            title.style.border = this._params.WindowHeaderBorder;
            title.style.backgroundColor = this._params.WindowHeaderBackgroundColor;
            title.style.fontFamily = this._params.WindowHeaderFontFamily
            title.style.color = this._params.WindowHeaderColor;
            title.style.fontSize = this._params.WindowHeaderFontSize.toString() + "px";
            title.style.paddingLeft = "5px";
            title.style.whiteSpace = "nowrap";
            title.addEventListener("click", () => {this.brintToFront()});

            this._titleSpan = document.createElement("SPAN") as HTMLSpanElement;
            this._titleSpan.innerText = this._params.title;
            title.appendChild(this._titleSpan)

            if (this._params.closeIcon)
            {
                let closeDiv: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
                closeDiv.style.position = "absolute";
                closeDiv.style.right = "0px"
                closeDiv.style.top = "0px"
                closeDiv.style.width = Math.round(this._params.WindowHeaderHeight + 5).toString() + "px"
                closeDiv.style.height = this._params.WindowHeaderHeight.toString() + "px";
                closeDiv.style.overflow = "hide"
                closeDiv.style.paddingLeft = "5px";
                closeDiv.tabIndex = 0;
                closeDiv.style.cursor = "pointer";
                closeDiv.style.backgroundColor = this._params.WindowHeaderBackgroundColor;
                closeDiv.innerHTML = YoctoVisualization.ressources.CloseIcon(this._params.WindowHeaderHeight.toString(), false, false, false, false, "Click to close this window")
                closeDiv.addEventListener("click", () => {this.hide()});
                closeDiv.addEventListener("keypress", (e: KeyboardEvent) => {if (e.key == "Enter") this.hide()});

                title.appendChild(closeDiv)
            }

            if (this._params.positionType == WindowPositionType.SIDEANCHORED)
            {
                this._switchSideDiv = document.createElement("DIV") as HTMLDivElement;
                this._switchSideDiv.style.position = "absolute";
                this._switchSideDiv.style.width = Math.round(this._params.WindowHeaderHeight + 5).toString() + "px"
                this._switchSideDiv.style.right = Math.round(this._params.WindowHeaderHeight + 5) + "px"
                this._switchSideDiv.style.height = this._params.WindowHeaderHeight.toString() + "px";
                this._switchSideDiv.style.overflow = "hide"
                this._switchSideDiv.style.paddingLeft = "5px";
                this._switchSideDiv.style.top = "0px"
                this._switchSideDiv.style.cursor = "pointer";
                this._switchSideDiv.style.backgroundColor = this._params.WindowHeaderBackgroundColor;
                this._switchSideDiv.innerHTML = YoctoVisualization.ressources.MoveToLeftIcon(this._params.WindowHeaderHeight.toString(), false, false, false, false, "Click to move editor on left side")
                this._switchSideDiv.addEventListener("click", () => {this.switchSide()});
                title.appendChild(this._switchSideDiv)
            }
            this._div.appendChild(title);
        }

        if (this._params.buttons.length > 0)
        {
            this._buttonsContainer = document.createElement("DIV") as HTMLDivElement;
            this._buttonsContainer.style.position = "absolute";

            this._buttonsContainer.style.bottom = Math.round(this._params.WindowPadding).toString() + "px";
            this._buttonsContainer.style.right = Math.round(this._params.WindowPadding).toString() + "px";
            this._buttonsContainer.style.textAlign = "right"
            for (let i: number = 0; i < this._params.buttons.length; i++)
            {
                this._buttonsContainer.appendChild(this._params.buttons[i].Element)
            }
            this._div.appendChild(this._buttonsContainer);
            this._buttonsContainer.style.height = (25 * this._params.GUICoef).toString() + "px";
            this._params.bottomKeepClear += Math.round(35 * this._params.GUICoef)
        }

        this._contents.style.position = "absolute"
        this._contents.style.left = this._params.WindowPadding.toString() + "px"
        this._contents.style.right = this._params.WindowPadding.toString() + "px"
        this._contents.style.top = containerTop.toString() + "px"
        this._contents.style.bottom = (this._params.WindowPadding + this._params.bottomKeepClear).toString() + "px"
        this._contents.style.paddingLeft = "5px"
        this._contents.style.paddingRight = "5px"
        if (this._contents.style.fontSize == "")
        {
            this._contents.style.fontSize = this._params.contentsDefaultFontSize.toString() + "px"
        }
        if (this._contents.style.fontFamily == "")
        {
            this._contents.style.fontFamily = this._params.contentsDefaultFontFamily;
        }
        if (this._params.showContainerBorders)
        {
            this._contents.style.border = this._params.WindowInnerBorder;
            this._contents.style.backgroundColor = this._params.WindowInnerBackgroundColor;
        }
        else
        {
            this._contents.style.border = "1px solid rgba(0, 0, 0, 0)";
            this._contents.style.backgroundColor = "";
        }
        this._contents.style.overflow = "hide";
        this._div.append(this._contents);
        document.body.appendChild(this._div);

    }

    public hide()
    {
        if (this._div == null) return;
        this._div.style.display = "none";
        if (this._ModalDivShield != null) this._ModalDivShield.style.display = "none";
        if (this._params.closingCallBack != null) this._params.closingCallBack(this);
    }

    public set title(value: string)
    {
        this._params.title = value;
        if (this._titleSpan != null)
        {
            this._titleSpan.innerText = value;

        }
    }

    public brintToFront()
    {
        let n: number = -1;
        for (let i: number = 0; i < YWindow.windowList.length; i++)
        {
            if (YWindow.windowList[i] == this) n = i;
        }
        if (n < 0) return;
        YWindow.windowList.splice(n, 1);
        YWindow.windowList.push(this);
        for (let i: number = 0; i < YWindow.windowList.length; i++)
        {
            YWindow.windowList[i].zIndex = i;
        }
    }

    public set zIndex(index: number)
    {
        if (this._div == null) return
        this._div.style.zIndex = (100001 + 2 * index).toString();
        if (this._params.isModal) (<HTMLDivElement>this._ModalDivShield).style.zIndex = (100000 + 2 * index).toString();
    }

    public switchSide(): void
    {
        if ((<HTMLDivElement>this._div).style.left == "")
        {
            (<HTMLDivElement>this._div).style.left = "5px";
            (<HTMLDivElement>this._div).style.right = "";
            (<HTMLDivElement>this._switchSideDiv).innerHTML = YoctoVisualization.ressources.MoveToRightIcon(Math.round(20 * this._params.GUICoef).toString(), false, false, false, false, "Click to move editor on right side")
        }
        else
        {
            (<HTMLDivElement>this._div).style.left = "";
            (<HTMLDivElement>this._div).style.right = "5px";
            (<HTMLDivElement>this._switchSideDiv).innerHTML = YoctoVisualization.ressources.MoveToLeftIcon(Math.round(20 * this._params.GUICoef).toString(), false, false, false, false, "Click to move editor on left side")
        }
    }
}

export class confirm
{
    private static _window: YWindow;

    public static ask(message: string, yes: confirmCallback, no: confirmCallback | null, userdata: any): YWindow
    {
        let params: YoctoVisualization.newWindowParam = new YoctoVisualization.newWindowParam();
        params.positionType = WindowPositionType.CENTERED
        params.width = Math.min(Math.round(400 * YoctoVisualization.constants.generalSizeCoef), Math.round(screen.width * 0.9));
        params.height = Math.min(Math.round(160 * YoctoVisualization.constants.generalSizeCoef), Math.round(screen.height * 0.7));
        params.isModal = true;
        params.showHeader = false;
        params.showContainerBorders = false;
        let YesButton: button = new button("Yes",
            () =>
            {
                confirm._window.hide();
                if (yes != null) yes(userdata);
            });
        let NoButton: button = new button("No",
            () =>
            {
                confirm._window.hide();
                if (no != null) no(userdata);
            });

        params.buttons.push(YesButton);
        params.buttons.push(NoButton);

        confirm._window = new YWindow(params)
        let contents: HTMLDivElement = confirm._window.innerContentDiv;
        let table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
        table.style.width = "100%";

        let TR: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
        let TD: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
        TD.style.width = "10"
        TD.innerHTML = YoctoVisualization.ressources.DontKnowIcon(Math.round(80 * YoctoVisualization.constants.generalSizeCoef).toString(), true, false, false, false, "");
        TR.appendChild(TD)
        TD = document.createElement("TD") as HTMLTableCellElement;
        TD.style.paddingLeft = "20px"
        TD.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        TD.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";

        TD.style.textAlign = "justify"
        TD.innerText = message;
        TR.appendChild(TD)
        table.appendChild(TR)
        contents.appendChild(table)
        confirm._window.show()
        return confirm._window;
    }
}



 class notififaction
{
    private static _window: YWindow;

    public static show(icon:string,  message: string): YWindow
    {
        let params: YoctoVisualization.newWindowParam = new YoctoVisualization.newWindowParam();
        params.positionType = WindowPositionType.CENTERED
        params.width = Math.min(Math.round(400 * YoctoVisualization.constants.generalSizeCoef), screen.width);
        params.height = Math.min(Math.round(160 * YoctoVisualization.constants.generalSizeCoef), screen.height);

        params.isModal = true;
        params.showHeader = false;
        params.showContainerBorders = false;

        let okButton: button = new button("OK",
            () => {alert._window.hide(); });

        params.buttons.push(okButton);

        alert._window = new YWindow(params)
        let contents: HTMLDivElement = alert._window.innerContentDiv;
        let table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
        table.style.width = "100%";

        let TR: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
        let TD: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
        TD.style.width = "10"
        TD.innerHTML = icon
        TR.appendChild(TD)
        TD = document.createElement("TD") as HTMLTableCellElement;
        TD.style.paddingLeft = "20px"
        TD.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        TD.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
        TD.style.textAlign = "justify"
        TD.innerText = message;
        TR.appendChild(TD)
        table.appendChild(TR)
        contents.appendChild(table)
        alert._window.show()
        return alert._window;
    }
}

export class alert extends  notififaction
    {  public static show(  message: string): YWindow
        {  return super.show(YoctoVisualization.ressources.FailedIcon(Math.round(80 * YoctoVisualization.constants.generalSizeCoef).toString(), true, false, false, false, ""), message);

        }
    }

export class info extends  notififaction
    {  public static show(  message: string): YWindow
        {  return super.show(YoctoVisualization.ressources.OkIcon(Math.round(80 * YoctoVisualization.constants.generalSizeCoef).toString(), true, false, false, false, ""), message);

        }
    }
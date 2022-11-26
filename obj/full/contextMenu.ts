/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Right click context menu
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

export interface MenuItemCallBack {(): void;}

export interface MenuOpenCallBack {(mouseX: number, mouseY: number): void;}

export class ContextMenuSeparator
{
    private TR: HTMLTableRowElement;
    private TD_icon: HTMLTableCellElement;
    private TD_caption: HTMLTableCellElement;

    constructor()
    {
        this.TR = document.createElement("TR") as HTMLTableRowElement;
        (<any>this.TR)["objectData"] = this; // ok that's ugly,
        this.TR.className = ContextMenu.SEPARATOR_MARKER;
        this.TD_caption = document.createElement("TD") as HTMLTableCellElement;
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_caption.style.paddingLeft = "3px";
        this.TD_caption.style.paddingRight = "3px";
        let hr: HTMLHRElement = document.createElement("HR") as HTMLHRElement;
        this.TD_caption.colSpan = 2;
        this.TD_caption.appendChild(hr)
        this.TD_icon = document.createElement("TD") as HTMLTableCellElement;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
        this.TR.appendChild(this.TD_icon);
        this.TR.appendChild(this.TD_caption);
    }
    public toString(): string {return "Separator" }
    public get focusable(): boolean
    {
        return false;
    }
    public parentMenuisClosing() {};
    public get domData(): HTMLTableRowElement
    { return this.TR;}
}

interface MouseEventCallback {(e: MouseEvent): void}

interface KeyboardEventCallback {(e: KeyboardEvent): void}

interface FocusEventCallback {(): void}

export class ContextMenuItemBase
{
    private _TR_keydown: KeyboardEventCallback;
    private _TR_mouseover: MouseEventCallback;

    private _TR_mouseout: MouseEventCallback;
    private _A_click: MouseEventCallback;
    private _A_mouseover: MouseEventCallback;
    private _A_mouseout: MouseEventCallback;
    private _TR_focusin: FocusEventCallback;
    private _TR_focusout: FocusEventCallback;

    protected TR: HTMLTableRowElement;
    protected TD_icon: HTMLTableCellElement;
    protected TD_caption: HTMLTableCellElement;
    protected A_caption: HTMLAnchorElement;
    protected _menu: ContextMenuBase;

    protected _clickHidesMenu: boolean = true;
    protected _userdata: object | null = null;
    public get userdata(): object | null {return this._userdata;}
    public set userdata(value: object | null) { this._userdata = value;}

    constructor(menu: ContextMenuBase, icon: string | null, caption: string)
    {
        this._menu = menu;
        this.TR = document.createElement("TR") as HTMLTableRowElement;
        (<any>this.TR)["objectData"] = this; // ok that's ugly,
        this.TD_caption = document.createElement("TD") as HTMLTableCellElement;
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_caption.style.paddingLeft = "3px";
        this.TD_caption.style.paddingRight = "3px";
        this.TD_caption.style.whiteSpace="nowrap"
        this.TD_icon = document.createElement("TD") as HTMLTableCellElement;
        if (icon!=null) this.TD_icon.innerHTML = icon;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
        this.A_caption = document.createElement("A") as HTMLAnchorElement;
        this.A_caption.innerHTML = caption;
        this.TR.style.cursor = "pointer";
        this.TR.tabIndex = 0;
        this.TR.style.outline = "none";
        this._TR_keydown = (e: KeyboardEvent) =>
        {
            e.preventDefault();
            this.keydown(e);
        }
        this._TR_mouseover = (e: MouseEvent) => {this.mouserOver(e);}
        this._TR_mouseout = (e: MouseEvent) => {this.mouserOut(e);}
        this._A_mouseover = (e: MouseEvent) => {this.mouserOver(e);}
        this._A_mouseout = (e: MouseEvent) => {this.mouserOut(e);}
        this._A_click = (e: MouseEvent) => {this.activate();}
        this._TR_focusin = () => {this.focusIn();}
        this._TR_focusout = () => {this.focusOut();}
        this.TR.addEventListener("mouseover", this._TR_mouseover)
        this.TR.addEventListener("mouseout", this._TR_mouseout)
        //this.A_caption.addEventListener("click", this._A_click)
        this.TR.addEventListener("click", this._A_click)

        this.TR.addEventListener("keydown", this._TR_keydown)

        this.A_caption.addEventListener("mouseover", this._A_mouseover)
        this.A_caption.addEventListener("mouseout", this._A_mouseout)
        this.TD_caption.appendChild(this.A_caption);
        this.TR.appendChild(this.TD_icon);
        this.TR.appendChild(this.TD_caption);
        this.TR.addEventListener("focusin", this._TR_focusin)
        this.TR.addEventListener("focusout", this._TR_focusout)
    }
    public toString(): string {return this.TD_caption.innerText }

    public get focusable(): boolean
    {
        return this.visible;

    }

    protected activate(): void {}
    public focus()
    {
        this.TR.focus()
        this._menu.closeSubmenus();
    }

    protected focusIn(): void
    {
        if (this.TD_caption.style.backgroundColor == ContextMenu.iconBGColor) this._menu.closeSubmenus();
        this.TD_caption.style.backgroundColor = ContextMenu.ActiveColor;
        this.TD_icon.style.backgroundColor = ContextMenu.ActiveColor;

    }
    protected focusOut(): void
    {
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;

    }

    public removeAndDestroy(): void
    {
        if (this.TR.parentNode != null) this.TR.parentNode.removeChild(this.TR);
        this.TR.removeEventListener("keydown", this._TR_keydown)
        this.TR.removeEventListener("mouseover", this._TR_mouseover)
        this.TR.removeEventListener("mouseout", this._TR_mouseout)
        this.A_caption.removeEventListener("mouseover", this._A_mouseover)
        this.A_caption.removeEventListener("mouseout", this._A_mouseout)
        this.A_caption.removeEventListener("click", this._A_click)
        this.TR.removeEventListener("focusin", this._TR_focusin)
        this.TR.removeEventListener("focusout", this._TR_focusout)
    }

    public set caption(value: string) {this.A_caption.innerHTML = value;}
    public get caption(): string {return this.A_caption.innerHTML }

    protected keydown(e: KeyboardEvent): void
    {
        if (e.code == "ArrowDown") this._menu.activateNext(this);
        if (e.code == "ArrowUp") this._menu.activatePrevious(this);
        if (e.code == "Enter") this.activate();
        if (e.code == "Escape")
        {
            this._menu.close();
            if (this._menu.parentMenuItem != null) this._menu.parentMenuItem.focus();
        }
        if (e.code == "ArrowLeft")
        {
            if (this._menu.parentMenuItem != null)
            {
                this._menu.close();
                this._menu.parentMenuItem.focus();
            }
        }
    }

    protected mouserOver(e: MouseEvent | null): void
    {
        this.TD_caption.style.backgroundColor = ContextMenu.ActiveColor;
        this.TD_icon.style.backgroundColor = ContextMenu.ActiveColor;
        this._menu.closeSubmenus();
    }

    protected mouserOut(e: MouseEvent | null): void
    {
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
    }

    public get domData(): HTMLTableRowElement
    {
        return this.TR;
    }

    public get visible(): boolean { return this.TR.style.display != "none"}
    public set visible(value: boolean) { this.TR.style.display = value ? "" : "none"; }
    public parentMenuisClosing() {};

    public closeMenu(all: boolean): void
    {
        if (all) this._menu.closeAll(); else this._menu.close();

    }

}

export class ContextMenuItem extends ContextMenuItemBase
{
    protected _callback: MenuItemCallBack | null;
    protected activate(): void
    {
        if (this._clickHidesMenu) this.closeMenu(true);
        if (this._callback != null) this._callback()
    }

    constructor(menu: ContextMenuBase, icon: string | null, caption: string, callback: MenuItemCallBack | null)
    {
        super(menu, icon, caption);
        this._callback = callback;
        this.TD_caption.colSpan = 2;
    }
}

export class ContextMenuItemSubMenuEntry extends ContextMenuItem
{
    private _submenu: ContextMenuBase;
    private _parentmenu: ContextMenuBase;
    protected TD_arrow: HTMLTableCellElement;

    constructor(menu: ContextMenuBase, icon: string, caption: string, submenu: ContextMenuBase)
    {
        super(menu, icon, caption, null)
        this.TD_caption.colSpan = 1;
        this._submenu = submenu;
        this._submenu.parentMenuItem = this;
        this._parentmenu = menu;
        this._clickHidesMenu = false;
        this.TD_arrow = document.createElement("TD") as HTMLTableCellElement;
        this.TD_arrow.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_arrow.style.textAlign = "right";
        this.TD_arrow.style.paddingRight = "3px";
        this.TD_arrow.innerHTML = "&#9654;"
        this.TR.appendChild(this.TD_arrow);
        this.A_caption.addEventListener("click", (e: MouseEvent) => { this.showSubmenu();});
        this.A_caption.addEventListener("touchstart", (e: TouchEvent) =>
            {
                if (e.touches.length == 1) this.activate()

            }
        );

        this._submenu.zIndex = this._parentmenu.zIndex + 1;
    }

    protected keydown(e: KeyboardEvent): void
    {
        super.keydown(e);
        if (e.code == "ArrowRight")
        {
            this.activate();
            this._submenu.focusFirst();
        }

    }

    public removeAndDestroy(): void
    {
        this._submenu.close();
        this._submenu.destroy();
        super.removeAndDestroy()
    }

    protected activate()
    {
        this.showSubmenu();
    }

    public get submenu(): ContextMenuBase { return this._submenu}

    protected showSubmenu()
    {
        this._submenu.zIndex = this._parentmenu.zIndex + 1;
        let x: number = 0;
        let y: number = 0;
        let it: HTMLElement = this.TR;
        do
        {
            x += it.offsetLeft || 0;
            y += it.offsetTop || 0;

            it = it.offsetParent as HTMLElement;
        } while (it);

        this._submenu.showContextMenu(x + this._parentmenu.width - 15, y + 5);

    }

    protected focusIn(): void

    {
        super.focusIn();
        this.TD_arrow.style.backgroundColor = ContextMenu.ActiveColor;
    }

    protected focusOut(): void
    {
        super.focusOut();
        this.TD_arrow.style.backgroundColor = ContextMenu.iconBGColor;

    }

    public parentMenuisClosing()
    {
        this._submenu.close();
    };

    protected mouserOver(e: MouseEvent): void
    { //this._menu.closeSubmenus();
        this.focusIn()
        this._parentmenu.setDelayedAction(() => { if (this.visible) this.showSubmenu(); })

    }

    protected mouserOut(e: MouseEvent): void
    {
        this._parentmenu.cancelDelayedAction();
        this.focusOut()

    }
}

class ContextMenuBase
{
    public static readonly SEPARATOR_MARKER = "separator";
    public static readonly iconBGColor: string = "#fdfdfd";
    public static readonly captionBgColor: string = "#f1f1f1";
    public static readonly ActiveColor: string = "#c4e1ff";
    protected _visible: boolean = false;
    protected _openCallback: MenuOpenCallBack | null;
    protected _zIndex = 100002;
    protected _parentmenu: ContextMenuBase | null = null;
    protected _parentMenuItem: ContextMenuItemBase | null = null;
    public get parentMenuItem(): ContextMenuItemBase | null {return this._parentMenuItem}
    public set parentMenuItem(value: ContextMenuItemBase | null) { this._parentMenuItem = value }
    private _timer: any;

    protected _userdata: object | null = null;
    public get userdata(): object | null {return this._userdata;}
    public set userdata(value: object | null) { this._userdata = value;}

    protected Menutable: HTMLTableElement;
    constructor(baseSize: number, openCallback: MenuOpenCallBack | null, fontFamily?: string)
    {
        this._openCallback = openCallback;
        this.Menutable = document.createElement("TABLE") as HTMLTableElement;
        this.Menutable.style.position = "absolute";
        this.Menutable.style.border = "1px solid #808080";
        if (typeof fontFamily !== "undefined") this.Menutable.style.fontFamily = fontFamily;
        this.Menutable.style.fontSize = (2 * baseSize / 3).toFixed(1) + "px";
        this.Menutable.style.borderSpacing = "0";
        this.Menutable.style.boxShadow = " 4px 4px 4px 1px rgba(0,0,0,0.05)";
        this.Menutable.style.zIndex = this._zIndex.toString();
        this._timer = null;
        this.visible = false;
    }
    public closeAll()
    {
        this.close();
        if (this._parentmenu != null) (this._parentmenu).closeAll();

    }

    public cancelDelayedAction()
    {
        if (this._timer != null)
        {
            clearTimeout(this._timer);
            this._timer = null
        }
    }

    public setDelayedAction(action: MenuItemCallBack)
    {
        this.cancelDelayedAction()
        this._timer = setTimeout(() => {action(); }, 500);
    }

    public get parentMenu(): ContextMenuBase | null {return this._parentmenu}

    public destroy()
    {
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            item.removeAndDestroy();
        }
        if (this.Menutable.parentNode != null) this.Menutable.parentNode.removeChild(this.Menutable);
    }

    public focusFirst()
    {
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            if (item.focusable)
            {
                item.focus();
                return;
            }
        }
    }

    public toString(): string
    {
        let res: string = '';
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            res = res + item.caption + "";
        }
        return res;
    }

    public isXYOnMenu(x: number, y: number): boolean
    {
        if (!this.visible) return false;
        if ((x >= this.Menutable.offsetLeft) && (x <= this.Menutable.offsetLeft + this.Menutable.offsetWidth)
            && (y >= this.Menutable.offsetTop) && (y <= this.Menutable.offsetTop + this.Menutable.offsetHeight))
        {
            return true;
        }

        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            if (item instanceof ContextMenuItemSubMenuEntry)
            {
                if ((item as ContextMenuItemSubMenuEntry).submenu.isXYOnMenu(x, y)) return true;

            }
        }
        return false;

    }

    public activateNext(source: ContextMenuItemBase)
    {
        let found: boolean = false;
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            if (item == source)
            { found = true; }
            else if (found && item.focusable)
            {
                item.focus();
                return;
            }
        }

    }

    public activatePrevious(source: ContextMenuItemBase)
    {
        let previous: ContextMenuItemBase | null = null;
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            if (item == source)
            {
                if (previous != null) previous.focus();
                return;
            }
            if (item.focusable) previous = item;

        }
    }

    public get width(): number
    { return this.Menutable.offsetWidth}

    public closeSubmenus()
    {
        this.closeSubMenusExcept(null);
    }

    public get zIndex(): number { return this._zIndex;}
    public set zIndex(value: number)
    {
        this._zIndex = value;
        this.Menutable.style.zIndex = this._zIndex.toString();

    }

    public get visible(): boolean {return this.Menutable.style.display != "none";}
    public set visible(value: boolean)
    { this.Menutable.style.display = (value ? "" : "none");}

    public close()
    {
        this.cancelDelayedAction();
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            item.parentMenuisClosing();
        }
        this.visible = false;
        this.closeSubmenus();

    }

    public refresh()  // Hides unnecessary separators
    {
        let showSeparation: boolean = false

        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let element: HTMLElement = <HTMLElement>this.Menutable.childNodes[i];
            if (element.className == ContextMenu.SEPARATOR_MARKER)
            {
                element.style.display = showSeparation ? "" : "none";
                showSeparation = false;
            }
            else if (element.style.display == "") showSeparation = true;

        }
    }

    public addMenuItem(icon: string |null, caption: string, callback: MenuItemCallBack): ContextMenuItem
    {
        let menuItem: ContextMenuItem = new ContextMenuItem(this, icon, caption, callback);
        this.Menutable.appendChild(menuItem.domData)
        return menuItem;
    }
    public get menuItemsCount(): number
    {
        return this.Menutable.childNodes.length;

    }

    public closeSubMenusExcept(doNotClose: ContextMenuBase | null)
    {
        for (let i: number = 0; i < this.Menutable.childNodes.length; i++)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[i])["objectData"];
            if (item instanceof ContextMenuItemSubMenuEntry)
            {
                if (item.submenu != doNotClose)
                {
                    item.submenu.close()
                }

            }
        }
    }

    public subMenuisOpening(source: ContextMenuBase)
    {
        this.closeSubMenusExcept(source);
    }

    public addSubMenuItem(icon: string, caption: string, submenu: ContextMenuBase): ContextMenuItem
    {
        submenu.zIndex = this.zIndex + 1;
        let menuItem: ContextMenuItemSubMenuEntry = new ContextMenuItemSubMenuEntry(this, icon, caption, submenu);
        this.Menutable.appendChild(menuItem.domData)
        return menuItem;
    }

    public clearAllContents()
    {
        while (this.Menutable.childNodes.length > 0)
        {
            let item: ContextMenuItemBase = (<any>this.Menutable.childNodes[0])["objectData"]
            item.removeAndDestroy();

        }

    }

    public AddSeparator(): ContextMenuSeparator
    {
        let separator: ContextMenuSeparator = new ContextMenuSeparator();
        this.Menutable.appendChild(separator.domData);
        return separator;
    }

    public showContextMenu(x: number, y: number) {}

}

export class ContextSubMenu extends ContextMenuBase
{

    constructor(baseSize: number, parentMenu: ContextMenuBase, openCallback: MenuOpenCallBack | null, fontFamily?: string)
    {
        super(baseSize, openCallback, fontFamily)
        this._parentmenu = parentMenu;
        document.body.appendChild(this.Menutable);
    }

    public showContextMenu(x: number, y: number)
    {
        if (this._parentmenu != null) this._parentmenu.subMenuisOpening(this);
        if (this._openCallback != null) this._openCallback(x, y);
        this.Menutable.style.left = x.toString() + 'px';
        this.Menutable.style.top = y.toString() + 'px';
        this.visible = true;
        let right = this.Menutable.offsetLeft - this.Menutable.scrollLeft + this.Menutable.offsetWidth;
        let bottom = this.Menutable.offsetTop - this.Menutable.scrollTop + this.Menutable.offsetHeight;
        if (right > window.innerWidth) this.Menutable.style.left = (x - (right - window.innerWidth)).toString() + 'px';
        if (bottom > window.innerHeight) this.Menutable.style.top = (y - (bottom - window.innerHeight)).toString() + 'px';

    }
}

export class ContextMenu extends ContextMenuBase
{

    constructor(baseSize: number, openCallback: MenuOpenCallBack, fontFamily?: string)
    {
        super(baseSize, openCallback, fontFamily)

        document.addEventListener("contextmenu", (e: MouseEvent) =>
            {  let  tagname :string = "";
               // on Android long touch is used for both context menu and moving the cursor in an input
               if ((e.target!=null)  && YoctoVisualization.constants.RunningOnAndroid) tagname = (e.target as HTMLElement).tagName;
               if (tagname!="INPUT")
                 { e.preventDefault();
                   this.showContextMenu(e.pageX, e.pageY);
                 }
            }
        );
        document.addEventListener("dblclick", (e: MouseEvent) =>
        {
            if (YoctoVisualization.constants.dbleClickBringsUpContextMenu) this.showContextMenu(e.pageX, e.pageY);
        });
        document.addEventListener("click", (e: MouseEvent) => {this.click(e)})
        document.body.appendChild(this.Menutable);
    }

    private click(e: MouseEvent)
    {
        if (!this.visible) return;
        if (!this.isXYOnMenu(e.pageX, e.pageY))
        {
            this.close();
        }
    }

    public showContextMenu(x: number, y: number)
    {
        let z: number = YoctoVisualization.YWindow.ConTextMenuBestZindex;
        if (z < 0) return;
        this.zIndex = z;
        this.Menutable.style.left = x.toString() + 'px';
        this.Menutable.style.top = y.toString() + 'px';
        this.visible = true;
        let right = this.Menutable.offsetLeft - this.Menutable.scrollLeft + this.Menutable.offsetWidth;
        let bottom = this.Menutable.offsetTop - this.Menutable.scrollTop + this.Menutable.offsetHeight;
        if (right > window.innerWidth) this.Menutable.style.left = (Math.max(0, x - (right - window.innerWidth))).toString() + 'px';
        if (bottom > window.innerHeight) this.Menutable.style.top = (Math.max(0, y - (bottom - window.innerHeight))).toString() + 'px';
        if (this._openCallback != null) this._openCallback(x, y)

        if ((x <= 5) && (y <= 5)) this.focusFirst()

    }
}



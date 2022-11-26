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
export class ContextMenuSeparator {
    constructor() {
        this.TR = document.createElement("TR");
        this.TR["objectData"] = this; // ok that's ugly,
        this.TR.className = ContextMenu.SEPARATOR_MARKER;
        this.TD_caption = document.createElement("TD");
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_caption.style.paddingLeft = "3px";
        this.TD_caption.style.paddingRight = "3px";
        let hr = document.createElement("HR");
        this.TD_caption.colSpan = 2;
        this.TD_caption.appendChild(hr);
        this.TD_icon = document.createElement("TD");
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
        this.TR.appendChild(this.TD_icon);
        this.TR.appendChild(this.TD_caption);
    }
    toString() { return "Separator"; }
    get focusable() {
        return false;
    }
    parentMenuisClosing() { }
    ;
    get domData() { return this.TR; }
}
export class ContextMenuItemBase {
    get userdata() { return this._userdata; }
    set userdata(value) { this._userdata = value; }
    constructor(menu, icon, caption) {
        this._clickHidesMenu = true;
        this._userdata = null;
        this._menu = menu;
        this.TR = document.createElement("TR");
        this.TR["objectData"] = this; // ok that's ugly,
        this.TD_caption = document.createElement("TD");
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_caption.style.paddingLeft = "3px";
        this.TD_caption.style.paddingRight = "3px";
        this.TD_caption.style.whiteSpace = "nowrap";
        this.TD_icon = document.createElement("TD");
        if (icon != null)
            this.TD_icon.innerHTML = icon;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
        this.A_caption = document.createElement("A");
        this.A_caption.innerHTML = caption;
        this.TR.style.cursor = "pointer";
        this.TR.tabIndex = 0;
        this.TR.style.outline = "none";
        this._TR_keydown = (e) => {
            e.preventDefault();
            this.keydown(e);
        };
        this._TR_mouseover = (e) => { this.mouserOver(e); };
        this._TR_mouseout = (e) => { this.mouserOut(e); };
        this._A_mouseover = (e) => { this.mouserOver(e); };
        this._A_mouseout = (e) => { this.mouserOut(e); };
        this._A_click = (e) => { this.activate(); };
        this._TR_focusin = () => { this.focusIn(); };
        this._TR_focusout = () => { this.focusOut(); };
        this.TR.addEventListener("mouseover", this._TR_mouseover);
        this.TR.addEventListener("mouseout", this._TR_mouseout);
        //this.A_caption.addEventListener("click", this._A_click)
        this.TR.addEventListener("click", this._A_click);
        this.TR.addEventListener("keydown", this._TR_keydown);
        this.A_caption.addEventListener("mouseover", this._A_mouseover);
        this.A_caption.addEventListener("mouseout", this._A_mouseout);
        this.TD_caption.appendChild(this.A_caption);
        this.TR.appendChild(this.TD_icon);
        this.TR.appendChild(this.TD_caption);
        this.TR.addEventListener("focusin", this._TR_focusin);
        this.TR.addEventListener("focusout", this._TR_focusout);
    }
    toString() { return this.TD_caption.innerText; }
    get focusable() {
        return this.visible;
    }
    activate() { }
    focus() {
        this.TR.focus();
        this._menu.closeSubmenus();
    }
    focusIn() {
        if (this.TD_caption.style.backgroundColor == ContextMenu.iconBGColor)
            this._menu.closeSubmenus();
        this.TD_caption.style.backgroundColor = ContextMenu.ActiveColor;
        this.TD_icon.style.backgroundColor = ContextMenu.ActiveColor;
    }
    focusOut() {
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
    }
    removeAndDestroy() {
        if (this.TR.parentNode != null)
            this.TR.parentNode.removeChild(this.TR);
        this.TR.removeEventListener("keydown", this._TR_keydown);
        this.TR.removeEventListener("mouseover", this._TR_mouseover);
        this.TR.removeEventListener("mouseout", this._TR_mouseout);
        this.A_caption.removeEventListener("mouseover", this._A_mouseover);
        this.A_caption.removeEventListener("mouseout", this._A_mouseout);
        this.A_caption.removeEventListener("click", this._A_click);
        this.TR.removeEventListener("focusin", this._TR_focusin);
        this.TR.removeEventListener("focusout", this._TR_focusout);
    }
    set caption(value) { this.A_caption.innerHTML = value; }
    get caption() { return this.A_caption.innerHTML; }
    keydown(e) {
        if (e.code == "ArrowDown")
            this._menu.activateNext(this);
        if (e.code == "ArrowUp")
            this._menu.activatePrevious(this);
        if (e.code == "Enter")
            this.activate();
        if (e.code == "Escape") {
            this._menu.close();
            if (this._menu.parentMenuItem != null)
                this._menu.parentMenuItem.focus();
        }
        if (e.code == "ArrowLeft") {
            if (this._menu.parentMenuItem != null) {
                this._menu.close();
                this._menu.parentMenuItem.focus();
            }
        }
    }
    mouserOver(e) {
        this.TD_caption.style.backgroundColor = ContextMenu.ActiveColor;
        this.TD_icon.style.backgroundColor = ContextMenu.ActiveColor;
        this._menu.closeSubmenus();
    }
    mouserOut(e) {
        this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
    }
    get domData() {
        return this.TR;
    }
    get visible() { return this.TR.style.display != "none"; }
    set visible(value) { this.TR.style.display = value ? "" : "none"; }
    parentMenuisClosing() { }
    ;
    closeMenu(all) {
        if (all)
            this._menu.closeAll();
        else
            this._menu.close();
    }
}
export class ContextMenuItem extends ContextMenuItemBase {
    activate() {
        if (this._clickHidesMenu)
            this.closeMenu(true);
        if (this._callback != null)
            this._callback();
    }
    constructor(menu, icon, caption, callback) {
        super(menu, icon, caption);
        this._callback = callback;
        this.TD_caption.colSpan = 2;
    }
}
export class ContextMenuItemSubMenuEntry extends ContextMenuItem {
    constructor(menu, icon, caption, submenu) {
        super(menu, icon, caption, null);
        this.TD_caption.colSpan = 1;
        this._submenu = submenu;
        this._submenu.parentMenuItem = this;
        this._parentmenu = menu;
        this._clickHidesMenu = false;
        this.TD_arrow = document.createElement("TD");
        this.TD_arrow.style.backgroundColor = ContextMenu.iconBGColor;
        this.TD_arrow.style.textAlign = "right";
        this.TD_arrow.style.paddingRight = "3px";
        this.TD_arrow.innerHTML = "&#9654;";
        this.TR.appendChild(this.TD_arrow);
        this.A_caption.addEventListener("click", (e) => { this.showSubmenu(); });
        this.A_caption.addEventListener("touchstart", (e) => {
            if (e.touches.length == 1)
                this.activate();
        });
        this._submenu.zIndex = this._parentmenu.zIndex + 1;
    }
    keydown(e) {
        super.keydown(e);
        if (e.code == "ArrowRight") {
            this.activate();
            this._submenu.focusFirst();
        }
    }
    removeAndDestroy() {
        this._submenu.close();
        this._submenu.destroy();
        super.removeAndDestroy();
    }
    activate() {
        this.showSubmenu();
    }
    get submenu() { return this._submenu; }
    showSubmenu() {
        this._submenu.zIndex = this._parentmenu.zIndex + 1;
        let x = 0;
        let y = 0;
        let it = this.TR;
        do {
            x += it.offsetLeft || 0;
            y += it.offsetTop || 0;
            it = it.offsetParent;
        } while (it);
        this._submenu.showContextMenu(x + this._parentmenu.width - 15, y + 5);
    }
    focusIn() {
        super.focusIn();
        this.TD_arrow.style.backgroundColor = ContextMenu.ActiveColor;
    }
    focusOut() {
        super.focusOut();
        this.TD_arrow.style.backgroundColor = ContextMenu.iconBGColor;
    }
    parentMenuisClosing() {
        this._submenu.close();
    }
    ;
    mouserOver(e) {
        this.focusIn();
        this._parentmenu.setDelayedAction(() => { if (this.visible)
            this.showSubmenu(); });
    }
    mouserOut(e) {
        this._parentmenu.cancelDelayedAction();
        this.focusOut();
    }
}
class ContextMenuBase {
    get parentMenuItem() { return this._parentMenuItem; }
    set parentMenuItem(value) { this._parentMenuItem = value; }
    get userdata() { return this._userdata; }
    set userdata(value) { this._userdata = value; }
    constructor(baseSize, openCallback, fontFamily) {
        this._visible = false;
        this._zIndex = 100002;
        this._parentmenu = null;
        this._parentMenuItem = null;
        this._userdata = null;
        this._openCallback = openCallback;
        this.Menutable = document.createElement("TABLE");
        this.Menutable.style.position = "absolute";
        this.Menutable.style.border = "1px solid #808080";
        if (typeof fontFamily !== "undefined")
            this.Menutable.style.fontFamily = fontFamily;
        this.Menutable.style.fontSize = (2 * baseSize / 3).toFixed(1) + "px";
        this.Menutable.style.borderSpacing = "0";
        this.Menutable.style.boxShadow = " 4px 4px 4px 1px rgba(0,0,0,0.05)";
        this.Menutable.style.zIndex = this._zIndex.toString();
        this._timer = null;
        this.visible = false;
    }
    closeAll() {
        this.close();
        if (this._parentmenu != null)
            (this._parentmenu).closeAll();
    }
    cancelDelayedAction() {
        if (this._timer != null) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
    setDelayedAction(action) {
        this.cancelDelayedAction();
        this._timer = setTimeout(() => { action(); }, 500);
    }
    get parentMenu() { return this._parentmenu; }
    destroy() {
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            item.removeAndDestroy();
        }
        if (this.Menutable.parentNode != null)
            this.Menutable.parentNode.removeChild(this.Menutable);
    }
    focusFirst() {
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            if (item.focusable) {
                item.focus();
                return;
            }
        }
    }
    toString() {
        let res = '';
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            res = res + item.caption + "";
        }
        return res;
    }
    isXYOnMenu(x, y) {
        if (!this.visible)
            return false;
        if ((x >= this.Menutable.offsetLeft) && (x <= this.Menutable.offsetLeft + this.Menutable.offsetWidth)
            && (y >= this.Menutable.offsetTop) && (y <= this.Menutable.offsetTop + this.Menutable.offsetHeight)) {
            return true;
        }
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            if (item instanceof ContextMenuItemSubMenuEntry) {
                if (item.submenu.isXYOnMenu(x, y))
                    return true;
            }
        }
        return false;
    }
    activateNext(source) {
        let found = false;
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            if (item == source) {
                found = true;
            }
            else if (found && item.focusable) {
                item.focus();
                return;
            }
        }
    }
    activatePrevious(source) {
        let previous = null;
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            if (item == source) {
                if (previous != null)
                    previous.focus();
                return;
            }
            if (item.focusable)
                previous = item;
        }
    }
    get width() { return this.Menutable.offsetWidth; }
    closeSubmenus() {
        this.closeSubMenusExcept(null);
    }
    get zIndex() { return this._zIndex; }
    set zIndex(value) {
        this._zIndex = value;
        this.Menutable.style.zIndex = this._zIndex.toString();
    }
    get visible() { return this.Menutable.style.display != "none"; }
    set visible(value) { this.Menutable.style.display = (value ? "" : "none"); }
    close() {
        this.cancelDelayedAction();
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            item.parentMenuisClosing();
        }
        this.visible = false;
        this.closeSubmenus();
    }
    refresh() {
        let showSeparation = false;
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let element = this.Menutable.childNodes[i];
            if (element.className == ContextMenu.SEPARATOR_MARKER) {
                element.style.display = showSeparation ? "" : "none";
                showSeparation = false;
            }
            else if (element.style.display == "")
                showSeparation = true;
        }
    }
    addMenuItem(icon, caption, callback) {
        let menuItem = new ContextMenuItem(this, icon, caption, callback);
        this.Menutable.appendChild(menuItem.domData);
        return menuItem;
    }
    get menuItemsCount() {
        return this.Menutable.childNodes.length;
    }
    closeSubMenusExcept(doNotClose) {
        for (let i = 0; i < this.Menutable.childNodes.length; i++) {
            let item = this.Menutable.childNodes[i]["objectData"];
            if (item instanceof ContextMenuItemSubMenuEntry) {
                if (item.submenu != doNotClose) {
                    item.submenu.close();
                }
            }
        }
    }
    subMenuisOpening(source) {
        this.closeSubMenusExcept(source);
    }
    addSubMenuItem(icon, caption, submenu) {
        submenu.zIndex = this.zIndex + 1;
        let menuItem = new ContextMenuItemSubMenuEntry(this, icon, caption, submenu);
        this.Menutable.appendChild(menuItem.domData);
        return menuItem;
    }
    clearAllContents() {
        while (this.Menutable.childNodes.length > 0) {
            let item = this.Menutable.childNodes[0]["objectData"];
            item.removeAndDestroy();
        }
    }
    AddSeparator() {
        let separator = new ContextMenuSeparator();
        this.Menutable.appendChild(separator.domData);
        return separator;
    }
    showContextMenu(x, y) { }
}
ContextMenuBase.SEPARATOR_MARKER = "separator";
ContextMenuBase.iconBGColor = "#fdfdfd";
ContextMenuBase.captionBgColor = "#f1f1f1";
ContextMenuBase.ActiveColor = "#c4e1ff";
export class ContextSubMenu extends ContextMenuBase {
    constructor(baseSize, parentMenu, openCallback, fontFamily) {
        super(baseSize, openCallback, fontFamily);
        this._parentmenu = parentMenu;
        document.body.appendChild(this.Menutable);
    }
    showContextMenu(x, y) {
        if (this._parentmenu != null)
            this._parentmenu.subMenuisOpening(this);
        if (this._openCallback != null)
            this._openCallback(x, y);
        this.Menutable.style.left = x.toString() + 'px';
        this.Menutable.style.top = y.toString() + 'px';
        this.visible = true;
        let right = this.Menutable.offsetLeft - this.Menutable.scrollLeft + this.Menutable.offsetWidth;
        let bottom = this.Menutable.offsetTop - this.Menutable.scrollTop + this.Menutable.offsetHeight;
        if (right > window.innerWidth)
            this.Menutable.style.left = (x - (right - window.innerWidth)).toString() + 'px';
        if (bottom > window.innerHeight)
            this.Menutable.style.top = (y - (bottom - window.innerHeight)).toString() + 'px';
    }
}
export class ContextMenu extends ContextMenuBase {
    constructor(baseSize, openCallback, fontFamily) {
        super(baseSize, openCallback, fontFamily);
        document.addEventListener("contextmenu", (e) => {
            let tagname = "";
            // on Android long touch is used for both context menu and moving the cursor in an input
            if ((e.target != null) && YoctoVisualization.constants.RunningOnAndroid)
                tagname = e.target.tagName;
            if (tagname != "INPUT") {
                e.preventDefault();
                this.showContextMenu(e.pageX, e.pageY);
            }
        });
        document.addEventListener("dblclick", (e) => {
            if (YoctoVisualization.constants.dbleClickBringsUpContextMenu)
                this.showContextMenu(e.pageX, e.pageY);
        });
        document.addEventListener("click", (e) => { this.click(e); });
        document.body.appendChild(this.Menutable);
    }
    click(e) {
        if (!this.visible)
            return;
        if (!this.isXYOnMenu(e.pageX, e.pageY)) {
            this.close();
        }
    }
    showContextMenu(x, y) {
        let z = YoctoVisualization.YWindow.ConTextMenuBestZindex;
        if (z < 0)
            return;
        this.zIndex = z;
        this.Menutable.style.left = x.toString() + 'px';
        this.Menutable.style.top = y.toString() + 'px';
        this.visible = true;
        let right = this.Menutable.offsetLeft - this.Menutable.scrollLeft + this.Menutable.offsetWidth;
        let bottom = this.Menutable.offsetTop - this.Menutable.scrollTop + this.Menutable.offsetHeight;
        if (right > window.innerWidth)
            this.Menutable.style.left = (Math.max(0, x - (right - window.innerWidth))).toString() + 'px';
        if (bottom > window.innerHeight)
            this.Menutable.style.top = (Math.max(0, y - (bottom - window.innerHeight))).toString() + 'px';
        if (this._openCallback != null)
            this._openCallback(x, y);
        if ((x <= 5) && (y <= 5))
            this.focusFirst();
    }
}

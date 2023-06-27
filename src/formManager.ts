/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Widgets (gauges, display, graph) manger
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
import * as YoctoAPI from "./YoctoApiFull.js";



interface WindowResizeCallback {(): void}
//#ifndef READONLY

class ResizeMoveHandle
  {   private static readonly HANDLESIZE: number = Math.round(20 * (1 + 2 * (YoctoVisualization.constants.guiDPIFactor - 1)));
      private static activeColor : string = "lightgreen";
      private static inactiveColor : string = "grey";

      public  static RESIZEHANDLE_TOPLEFT      = 0;
      public  static RESIZEHANDLE_TOPCENTER    = 1;
      public  static RESIZEHANDLE_TOPRIGHT     = 2;
      public  static RESIZEHANDLE_CENTERRIGHT  = 3;
      public  static RESIZEHANDLE_BOTTOMRIGHT  = 4;
      public  static RESIZEHANDLE_BOTTOMCENTER = 5;
      public  static RESIZEHANDLE_BOTTOMLEFT   = 6;
      public  static RESIZEHANDLE_CENTERLEFT   = 7;
      public  static RESIZEHANDLE_CENTER       = 8;

      public  static RESIZEHANDLE_data : number[][] =
        [[0,0,  0,7,  2,5,  7,10, 10,7,  5,2,  7,0   ],  // top left
            [6,0,  11,5,  8,5,  8,12, 4,12,  4,5,  1,5  ],  // top center
            [12,0, 12,7, 10,5, 5,10, 2,7,   7,2,  5,0   ],  // top right
            [12,6, 7,11, 7,8,  0,8,  0,4,   7,4,  7,1 ],   // center right
            [12,12,5,12, 7,10, 2,5,  5,2,   10,7,  12,5],   // bottom right
            [6,12, 1,7,  4,7,  4,0,  8,0,   8,7,  11,7],   // bottom center
            [0,12, 0,5,  2,7,  7,2,  10,5,   5,10,  7,12 ],  // bottom left
            [0,6,  5,1,  5,4,  12,4, 12,8,  5,8,  5,11],   // center left
            [6,0,  8,2,  7,2,  7,5, 10,5, 10,4,   12,6,   // center
                10,8, 10,7, 7,7,  7,10, 8,10, 6,12,
                4,10,  5,10,  5,7,  2,7, 2,8,  0,6,
                2,4,  2,5,  5,5,  5,2, 4,2]];

      private index : number;

      private container : HTMLElement
      private div       : HTMLDivElement
      private svg       : SVGSVGElement
      private arrow     : SVGPathElement
      private circle    : SVGCircleElement
      private isactive  : boolean;

      constructor(container : HTMLElement,  index :number, mouseDownListener : any, touchStartlistener : any )
      { this.index=index;
        this.container = container;
        this.isactive=false;
        this.div = document.createElement("DIV") as HTMLDivElement;
        let size :number  = (ResizeMoveHandle.HANDLESIZE - 2);
        if (this.index==ResizeMoveHandle.RESIZEHANDLE_CENTER) size=size*2;

          //  YWidget.editHandles[i].innerHTML = YoctoVisualization.ressources.resizeHandleSVGcode(i,size,false);
          this.div.style.position = "absolute";
          this.div.style.border = "0px solid black";
          this.div.style.background = "transparent";
          this.div.style.pointerEvents = "auto";
          this.div.style.width = size.toString() + "px";
          this.div.style.height = size.toString() + "px";

          switch(index)
          { case  ResizeMoveHandle.RESIZEHANDLE_TOPLEFT :
                  this.div.style.cursor = "nw-resize"
                  this.div.style.left = "0px"
                  this.div.style.top = "0px"
                  break;
            case  ResizeMoveHandle.RESIZEHANDLE_TOPCENTER :
                  this.div.style.cursor = "n-resize"
                  this.div.style.top = "0px"
                  this.div.style.left = "50%"
                  this.div.style.transform = "translate(-50%,0)";
                  break;
              case ResizeMoveHandle.RESIZEHANDLE_TOPRIGHT:
                  this.div.style.cursor = "ne-resize"
                  this.div.style.right = "0px"
                  this.div.style.top = "0px"
                  break;
              case ResizeMoveHandle.RESIZEHANDLE_CENTERRIGHT:
                  this.div.style.cursor = "e-resize"
                  this.div.style.right = "0px"
                  this.div.style.top = "50%"
                  this.div.style.transform = "translate(0,-50%)";
                  break;
              case ResizeMoveHandle.RESIZEHANDLE_BOTTOMRIGHT :
                  this.div.style.cursor = "se-resize"
                  this.div.style.right = "0px"
                  this.div.style.bottom = "0px"
                  break;
              case    ResizeMoveHandle.RESIZEHANDLE_BOTTOMCENTER :
                  this.div.style.cursor = "s-resize"
                  this.div.style.bottom = "0px"
                  this.div.style.left = "50%"
                  this.div.style.transform = "translate(-50%,0)";
                  break;
              case ResizeMoveHandle.RESIZEHANDLE_BOTTOMLEFT :

                  this.div.style.cursor = "sw-resize"
                  this.div.style.left = "0px"
                  this.div.style.bottom = "0px"
                  break;
              case ResizeMoveHandle.RESIZEHANDLE_CENTERLEFT:
                  this.div.style.cursor = "w-resize"
                  this.div.style.left = "0px"
                  this.div.style.top = "50%"
                  this.div.style.transform = "translate(0,-50%)";
                  break;
              case ResizeMoveHandle.RESIZEHANDLE_CENTER :
                  this.div.style.cursor = "move"
                  this.div.style.left = "50%"
                  this.div.style.top = "50%"
                  this.div.style.transform = "translate(-50%,-50%)";
                  break;
          }

          this.container.appendChild(this.div);
          this.div.addEventListener("mousedown", mouseDownListener);
          this.div.addEventListener("touchstart",touchStartlistener  )


          this.svg= document.createElementNS("http://www.w3.org/2000/svg", "svg");
          this.svg.setAttribute("viewBox", "0 0 "+size+" "+size);
          this.svg.setAttribute("version", "1.1");
          this.svg.setAttribute("width", size.toString());
          this.svg.setAttribute("height", size.toString());


          let x : number =0;
          let y : number =0;
          let r : number=size;
          switch (this.index)
          {  case  ResizeMoveHandle.RESIZEHANDLE_TOPLEFT : break;
              case  ResizeMoveHandle.RESIZEHANDLE_TOPCENTER  : x = size/2;break;
              case  ResizeMoveHandle.RESIZEHANDLE_TOPRIGHT     : x=size;break;
              case  ResizeMoveHandle.RESIZEHANDLE_CENTERRIGHT  : x=size; y=size/2;break;
              case  ResizeMoveHandle.RESIZEHANDLE_BOTTOMRIGHT  : x=size;y=size;break;
              case  ResizeMoveHandle.RESIZEHANDLE_BOTTOMCENTER : x=size/2; y=size; break;
              case  ResizeMoveHandle.RESIZEHANDLE_BOTTOMLEFT   : y=size; break;
              case  ResizeMoveHandle.RESIZEHANDLE_CENTERLEFT   : y=size/2; break;
              case  ResizeMoveHandle.RESIZEHANDLE_CENTER       :  x=size/2;  y=size/2; r=size/2;break;

          }

          this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          this.circle.setAttribute("cx" , x.toString()  )
          this.circle.setAttribute("cy" , y.toString()  )
          this.circle.setAttribute("r" , r.toString()  )
          this.circle.setAttribute("style" , "fill:white"  )
          this.circle.setAttribute("opacity" , "0.75"  )
          this.svg.appendChild( this.circle);

          this.arrow= document.createElementNS("http://www.w3.org/2000/svg", "path");
          let d :string = "";
          for (let i :number=0;i<ResizeMoveHandle.RESIZEHANDLE_data[index].length>>1;i++)
          {   let x :number  = 1+ ((size-2)*ResizeMoveHandle.RESIZEHANDLE_data[index][i<<1]) /12.0;
              let y :number  = 1+ ((size-2)*ResizeMoveHandle.RESIZEHANDLE_data[index][1+(i<<1)])/12.0;

              d += i==0?'M ':'L '
              d += Math.round(x ).toString() +" "+  Math.round(y).toString()+ " ";
          }
          d +='z';
          this.arrow.setAttribute("d" , d )
          this.arrow.setAttribute("fill" , ResizeMoveHandle.inactiveColor )
          this.svg.appendChild( this.arrow);
          this.div.appendChild(this.svg);
          this.container.appendChild(this.div);



      }

     public get active() :boolean { return this.isactive;}
     public set active(value:boolean)
     {  if (value!=this.isactive)
        { this.isactive = value;
            this.arrow.setAttribute("fill" , this.active?ResizeMoveHandle.activeColor:ResizeMoveHandle.inactiveColor )

       }
     }
  }
//#endif

export class YWidget
{

    public static log(st: string) {YoctoVisualization.logForm.log(st);}

    protected UIContainer: HTMLCanvasElement;
    protected _genProp: YoctoVisualization.GenericProperties | null = null;
    protected _genRenderer: YDataRendering.YDataRenderer | null = null;
    private _windowResizeCallback: WindowResizeCallback;

    public SourceChanged(src: object, index?: number) {}
    public loadRecordedDataIfNeeded() {}
    public removeDataloggerData() {}

//#ifndef READONLY
    public delete(): void
    {
        this.editStopped();
        YoctoVisualization.sensorsManager.forgetForm(this)
        this.destroy();
    }

    public get confirmDeleteString(): string { return "not defined";}
//#endif

    public snapshot()
    {
        let w: number = 1024;
        let h: number = 1024;
        let ratio = this.UIContainer.offsetHeight != 0 ? this.UIContainer.offsetWidth / this.UIContainer.offsetHeight : 1
        switch (YoctoVisualization.constants.captureSizePolicy)
        {
        case  YDataRendering.YDataRenderer.CaptureFormats.Keep:
            w = this.UIContainer.offsetWidth;
            h = this.UIContainer.offsetHeight;
            break;
        case  YDataRendering.YDataRenderer.CaptureFormats.FixedHeight:
            h = YoctoVisualization.constants.captureHeight;
            w = h * ratio;
            break;
        case  YDataRendering.YDataRenderer.CaptureFormats.FixedWidth:
            w = YoctoVisualization.constants.captureWidth;
            h = w / ratio;
            break;
        case  YDataRendering.YDataRenderer.CaptureFormats.Fixed:
            w = YoctoVisualization.constants.captureWidth;
            h = YoctoVisualization.constants.captureHeight;
            break;
        }

        (<YDataRendering.YDataRenderer>this._genRenderer).captureAndDownloadImage(YoctoVisualization.constants.captureType,
            "", w, h, YoctoVisualization.constants.captureDPI);

    }

    private _BackColor: YDataRendering.YColor = YDataRendering.YColor.Transparent;
    public get BackColor(): YDataRendering.YColor { return this._BackColor; }
    public set BackColor(value: YDataRendering.YColor)
    {
        this._BackColor = value;
        this.UIContainer.style.backgroundColor = this._BackColor.htmlCode;
    }

    private _BorderColor: YDataRendering.YColor = YDataRendering.YColor.Gray;
    public get BorderColor(): YDataRendering.YColor { return this._BorderColor; }
    public set BorderColor(value: YDataRendering.YColor)
    {
        this._BorderColor = value;

        this.UIContainer.style.border = "1px solid " + this._BorderColor.htmlCode;
    }

    private get parentWidth(): number
    {
        if ((this.UIContainer.parentNode == document.body) || (this.UIContainer.parentNode == null)) return window.innerWidth

        return (this.UIContainer.parentNode as HTMLElement).clientWidth
    }

    private get parentHeight(): number
    {
        if ((this.UIContainer.parentNode == document.body) || (this.UIContainer.parentNode == null)) return window.innerHeight
        return (this.UIContainer.parentNode as HTMLElement).clientHeight
    }

    private get relativePositionX(): number
    {   if (this._SizeIsRelative) return this._relativePositionX;
        return this.sizeRound(100 * this.UIContainer.offsetLeft / this.parentWidth);

    }

    private _relativePositionX: number = 0;
    private set relativePositionX(value: number)
    {
        this._relativePositionX = value;
        this._PositionX = Math.round(value * this.parentWidth / 100);
    }

    private _relativePositionY: number = 0;
    private set relativePositionY(value: number)
    {
        this._relativePositionY = value;
        this._PositionY = Math.round(value * this.parentHeight / 100);
    }

    private get relativePositionY(): number
    {   if (this._SizeIsRelative) return this._relativePositionY;
        return   this.sizeRound(100 * this.UIContainer.offsetTop / this.parentHeight)

    }


    private _PositionX: number = 0;
    public get PositionX(): number
    { if (this._SizeIsRelative) return this.relativePositionX;
      return this.UIContainer.offsetLeft;
    }

    public set PositionX(value: number)
    {
        if (this._SizeIsRelative) this.relativePositionX = value; else this._PositionX = value;
        this.UIContainer.style.left = this._PositionX.toString() + "px";
        if (this._genRenderer != null) this._genRenderer.clearTransformationMatrix();
//#ifndef READONLY
        this.DrawHandles(this.UIContainer.offsetLeft, this.UIContainer.offsetTop,
            this.UIContainer.offsetWidth, this.UIContainer.offsetHeight);
//#endif
    }

    private _PositionY: number = 0;
    public get PositionY(): number
    {   if (this._SizeIsRelative) return this.relativePositionY;
        return this.UIContainer.offsetTop;
    }
    public set PositionY(value: number)
    {

        if (this._SizeIsRelative) this.relativePositionY = value; else this._PositionY = value;
        this.UIContainer.style.top = this._PositionY.toString() + "px";
        if (this._genRenderer != null) this._genRenderer.clearTransformationMatrix();
//#ifndef READONLY
        this.DrawHandles(this.UIContainer.offsetLeft, this.UIContainer.offsetTop,
            this.UIContainer.offsetWidth, this.UIContainer.offsetHeight);
//#endif
    }

    private sizeRound(v: number): number
    { return Math.round(100 * v) / 100}

    private get relativeWidth(): number
    {
      if (this._SizeIsRelative)  return this._relativeWidth;
      return this.sizeRound(100 * this.UIContainer.offsetWidth / this.parentWidth);
    }

    private _relativeWidth: number = 100;
    private set relativeWidth(value: number)
    {
        if (value <= 0) throw "Value must be strictly positive";
        this._relativeWidth = value;
        this._Width = Math.round(value * this.parentWidth / 100);
    }

    private _relativeHeight: number = 100;
    private set relativeHeight(value: number)
    {
        if (value <= 0) throw "Value must be strictly positive";
        this._relativeHeight = value;
        this._Height = Math.round(value * this.parentHeight / 100);
    }

    private get relativeHeight(): number
    {  if (this._SizeIsRelative) return this._relativeHeight
        return  this.sizeRound(100 * this.UIContainer.offsetHeight / this.parentHeight)

    }

    private updateRelativeSize()
        {   // if actual change was less than one pixel, then no need to update and add rounding artefacts.
            if  (Math.abs((this._relativeWidth * this.parentWidth / 100) - this.UIContainer.offsetWidth)>1)
                this._relativeWidth      = this.sizeRound(100 * this.UIContainer.offsetWidth / this.parentWidth)
            if  (Math.abs((this._relativeHeight * this.parentHeight / 100) - this.UIContainer.offsetHeight)>1)
                this._relativeHeight     = this.sizeRound(100 * this.UIContainer.offsetHeight / this.parentHeight)
            if  (Math.abs((this._relativePositionX *  this.parentWidth / 100) - this.UIContainer.offsetLeft)>1)
                this._relativePositionX  = this.sizeRound(100 * this.UIContainer.offsetLeft / this.parentWidth)
            if  (Math.abs((this._relativePositionY *  this.parentHeight / 100) - this.UIContainer.offsetTop)>1)
                this._relativePositionY  = this.sizeRound(100 * this.UIContainer.offsetTop / this.parentHeight)

        }

    private _Width: number = 300;
    public get Width(): number
    {
        if (this._SizeIsRelative) return this.relativeWidth; else return this.UIContainer.offsetWidth;
    }

    public set Width(value: number)
    {
        if (value <= 0) throw "Value must be strictly positive";
        if (this._SizeIsRelative) this.relativeWidth = value; else this._Width = value;
        this.UIContainer.style.width = (this._Width - 2).toString() + "px";
        this.UIContainer.width = this._Width - 2;
        if (this._genRenderer != null) this._genRenderer.clearTransformationMatrix();

//#ifndef READONLY
        this.DrawHandles(this.UIContainer.offsetLeft, this.UIContainer.offsetTop,
            this.UIContainer.offsetWidth, this.UIContainer.offsetHeight);
//#endif
        this.containerResized();
    }

    public _Height: number = 0;
    public get Height(): number
    {
        if (this._SizeIsRelative) return this.relativeHeight; else return this.UIContainer.offsetHeight;
    }

    public set Height(value: number)
    {
        if (value <= 0) throw "Value must be strictly positive";
        if (this._SizeIsRelative) this.relativeHeight = value; else this._Height = value;
        this.UIContainer.style.height = (this._Height - 2).toString() + "px";
        this.UIContainer.height = (this._Height - 2);
        if (this._genRenderer != null) this._genRenderer.clearTransformationMatrix();
//#ifndef READONLY
        this.DrawHandles(this.UIContainer.offsetLeft, this.UIContainer.offsetTop,
            this.UIContainer.offsetWidth, this.UIContainer.offsetHeight);
//#endif
        this.containerResized();

    }
    private _InitialSizeIsRelative: boolean = false;
    private _SizeIsRelative: boolean = false;
    public get SizeIsRelative(): boolean { return this._SizeIsRelative; }
    public set SizeIsRelative(value: boolean)
    {
        if (this._SizeIsRelative != value)
        {
            this._SizeIsRelative = value;
            if (this._SizeIsRelative)
            {
                this._relativePositionX = this.sizeRound(100 * this.UIContainer.offsetLeft / this.parentWidth);
                this._relativePositionY = this.sizeRound(100 * this.UIContainer.offsetTop / this.parentHeight);
                this._relativeWidth = this.sizeRound(100 * this.UIContainer.offsetWidth / this.parentWidth);
                this._relativeHeight = this.sizeRound(100 * this.UIContainer.offsetHeight / this.parentHeight);
            }
            this.windowResized();
        }

    }

    public _initialContainerID: string = "";
    public _containerID: string = "";
    public get containerID(): string { return this._containerID; }
    public set containerID(value: string)
    {
        if (this._containerID == value) return;

        let target: HTMLElement | null = (value != "") ? document.getElementById(value) : null;
        if ((value != "") && (target == null)) throw "No HTMLElement on the page with such ID (" + value + ")";
        if (this.UIContainer.parentNode != null)
        {
            this.UIContainer.parentNode.removeChild(this.UIContainer);
        }
        else
        {
            document.body.removeChild(this.UIContainer);
        }
        if (target != null)
        {   this.UIContainer.style.position="relative";
            target.insertBefore(this.UIContainer, target.firstChild);
        }
        else
        {   this.UIContainer.style.position="absolute";
            document.body.insertBefore(this.UIContainer, document.body.firstChild);
        }
        (<YDataRendering.YDataRenderer>this._genRenderer).clearTransformationMatrix();

        this.windowResized();
//#ifndef READONLY
        // move the   handles as well
        this.DrawHandles(this.UIContainer.offsetLeft, this.UIContainer.offsetTop, this.UIContainer.offsetWidth, this.UIContainer.offsetHeight);
//#endif
        this._containerID = value;

    }

    public _Text: string = "";
    public get Text(): string { return this._Text; }
    public set Text(value: string)
    {
        this._Text = value;
        this.UIContainer.title = value;
    }

    public set_name(name: string)
    {
        this.Text = name;
        (<YoctoVisualization.GenericProperties>this._genProp).Form_Text = name;
    }

    private windowResized()
    {
        (<YDataRendering.YDataRenderer>this._genRenderer).DisableRedraw();
        if (this._SizeIsRelative)
        {
            this.PositionX = this._relativePositionX;
            this.PositionY = this._relativePositionY;
            this.Height = this._relativeHeight; // will force to recompute the widget absolute size redraw it
            this.Width = this._relativeWidth;

        }
        this.containerResized();
        (<YDataRendering.YDataRenderer>this._genRenderer).AllowRedraw();

    }

    protected ApplyRelativeSizeIfRequired()
    {

        if (this._initialContainerID != "")
        {
            if (document.getElementById(this._initialContainerID) != null)
            {
                this.containerID = this._initialContainerID;
            }
            else
            {
                YoctoVisualization.logForm.log("Warning: cannot place widget in \"" + this._initialContainerID + "\" : no such HTML element.")
            }
        }

        this._SizeIsRelative = this._InitialSizeIsRelative
        this.windowResized()
    }

    public destroy(): void
    {
        window.removeEventListener('resize', this._windowResizeCallback);
        (<YDataRendering.YDataRenderer>this._genRenderer).destroy()
        Object.entries(this).forEach((pair: string[]) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL
    }

    public getContainerOffset(): YDataRendering.pointXY
    {
        let it: HTMLElement = this.UIContainer.offsetParent as HTMLElement;
        let absx: number = 0;
        let absy: number = 0;
        while (it)
        {
            absy += it.offsetTop;
            absx += it.offsetLeft;
            it = it.offsetParent as HTMLElement; // ugly cast, but it should work once compiled
        }
        return new YDataRendering.pointXY(absx, absy)
    }

    public contextMenuCallBack(mouseX: number, mouseY: number)
    {
        let p: YDataRendering.Point = (<YDataRendering.YDataRenderer>this._genRenderer).Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(mouseX, mouseY)).toPoint();
        if ((p.X >= 0) && (p.X <= this.UIContainer.offsetWidth)
            && (p.Y >= 0) && (p.Y <= this.UIContainer.offsetHeight))
        {
            this.contextMenuIsOpening();
        }
    }

    protected contextMenuIsOpening(): void {}

    constructor(node: YoctoVisualization.YXmlNode | null, editor:
//#ifndef READONLY
        YoctoVisualization.PropertiesForm2 |
//#endif
        null, default_x?: number, default_y?: number, default_width?: number, default_height?: number)
    {
        let left: number = typeof (default_x) != "undefined" ? default_x : 0;
        let top: number = typeof (default_y) != "undefined" ? default_y : 0;
        let width: number = typeof (default_width) != "undefined" ? default_width : 0;
        let height: number = typeof (default_height) != "undefined" ? default_height : 0;
        let bottom: number = Number.NaN;
        let right: number = Number.NaN;

        if (node != null)
        {
            let childnodes: YoctoVisualization.YXmlNodeDict = node.get_childsByName();
            if ("location" in childnodes)
            {
                let it: YoctoVisualization.YXmlNode = childnodes["location"];
                let attributes: { [index: string]: string } = it.get_attributes();
                if ("x" in attributes) left = parseInt(attributes["x"]);
                if ("y" in attributes) top = parseInt(attributes["y"]);
            }
            if ("size" in childnodes)
            {
                let it: YoctoVisualization.YXmlNode = childnodes["size"];
                let attributes: { [index: string]: string } = it.get_attributes();
                if ("w" in attributes) width = parseInt(attributes["w"]);
                if ("h" in attributes) height = parseInt(attributes["h"]);
            }
            if ("relativeCoord" in childnodes)
            {
                let it: YoctoVisualization.YXmlNode = childnodes["relativeCoord"];
                let attributes: { [index: string]: string } = it.get_attributes();
                if ("x" in attributes) this._relativePositionX = this.sizeRound(parseFloat(attributes["x"]));
                if ("y" in attributes) this._relativePositionY = this.sizeRound(parseFloat(attributes["y"]));
                if ("w" in attributes) this._relativeWidth = this.sizeRound(parseFloat(attributes["w"]));
                if ("h" in attributes) this._relativeHeight = this.sizeRound(parseFloat(attributes["h"]));
                if ("active" in attributes) this._InitialSizeIsRelative = (attributes["active"] as string).toUpperCase() == "TRUE";
            }
            if ("container" in childnodes)
            {
                let it: YoctoVisualization.YXmlNode = childnodes["container"];
                let attributes: { [index: string]: string } = it.get_attributes();
                if ("id" in attributes) this._initialContainerID = attributes["id"];
            }
        }

        this.UIContainer = document.createElement("CANVAS") as HTMLCanvasElement;
        this.UIContainer.style.position = "absolute";
        //#ifndef READONLY
        YWidget.currentEdited = null;
        //#endif

        let h : number =  window.innerHeight;
        let w : number =  window.innerWidth;
        this.PositionX = this._InitialSizeIsRelative ? Math.round( w*(this._relativePositionX /100)): left;
        this.PositionY = this._InitialSizeIsRelative ? Math.round( h*(this._relativePositionY /100)): top;
        this.Width     = this._InitialSizeIsRelative ? Math.round( w*(this._relativeWidth /100))    : width;
        this.Height    = this._InitialSizeIsRelative ? Math.round( h*(this._relativeHeight /100))    : height;
        this.UIContainer.style.border = "1px solid black";
        this.UIContainer.style.backgroundColor = this._BackColor.htmlCode;
        this.UIContainer.setAttribute("name", "YoctoVisualizationWidget");
        document.body.appendChild(this.UIContainer);

        this._windowResizeCallback = () => (this.windowResized());

        window.addEventListener('resize', this._windowResizeCallback);

    }
    public rearrangeZindexes()
    {
        let containers: NodeListOf<HTMLElement> = document.getElementsByName("YoctoVisualizationWidget");
        let n = 0;
        for (let i: number = 0; i < containers.length; i++)
        {
            if (containers[i] != this.UIContainer)
            {
                containers[i].style.zIndex = n.toString();
                n++
            }
        }
        this.UIContainer.style.zIndex = n.toString();
//#ifndef READONLY
        n++;
        YWidget.HandlesDiv.style.zIndex = n.toString();
//#endif
    }

    public SensorArrivalcallback(source: YoctoVisualization.CustomYSensor)
    {

    }

    public SensorStateChangedcallback(source: YoctoVisualization.CustomYSensor)
    {
        //#ifndef READONLY
        if (YWidget.currentEdited == this)
        {
            YoctoVisualization.YWebPage.refreshEditor()
        }
        //#endif
    }

    public SensorValuecallback(source: YoctoVisualization.CustomYSensor, M: YoctoAPI.YMeasure | null): void
    {

    }

//#ifndef READONLY
    private static readonly HANDLESIZE: number = Math.round(20 * (1 + 2 * (YoctoVisualization.constants.guiDPIFactor - 1)));   // TO delete eventually
    private static HandlesDiv: HTMLDivElement;

    /*private static editHandles: HTMLDivElement[] = [];
    private static TopLeftHandle: HTMLDivElement;
    private static TopHandleHandle: HTMLDivElement;
    private static TopRightHandle: HTMLDivElement;
    private static RightHandle: HTMLDivElement;
    private static BottomRightHandle: HTMLDivElement;
    private static BottomHandle: HTMLDivElement;
    private static BottomLeftHandle: HTMLDivElement;
    private static LeftHandle: HTMLDivElement;
    private static CenterHandle: HTMLDivElement;*/

    private static editHandles: ResizeMoveHandle[] =[];

    private resizeCaptureRunning: boolean = false;
    private resizeCaptureXOrigineMouse: number = 0;
    private resizeCaptureYOrigineMouse: number = 0;
    private resizeCaptureXOrigine: number = 0;
    private resizeCaptureYOrigine: number = 0;
    private resizeCaptureOriginalTop: number = 0;
    private resizeCaptureOriginalLeft: number = 0;
    private resizeCaptureOriginalWidth: number = 0;
    private resizeCaptureOriginalHeight: number = 0;
    private resizeCaptureHandleIndex: number = 0;
    private resizeCaptureOriginalMatrix: YDataRendering.Matrix3x3 | null = null;
    private resizeCaptureOriginalMatrixInv: YDataRendering.Matrix3x3 | null = null;

    private static currentEdited: YWidget | null = null;

    public get isBeingEdited(): boolean
    { return YWidget.currentEdited == this;}

    public static stopEdition()
    {
        if (YWidget.currentEdited != null)
        {
            YWidget.currentEdited.editStopped();
            YWidget.currentEdited = null;
        }
    }

    protected refreshProperties() {}

    public edit(): void
    {
        YWidget.stopEdition()
        YWidget.currentEdited = this;
        if (YWidget.editHandles.length <= 0)
        {   YWidget.HandlesDiv = document.createElement("DIV") as HTMLDivElement;



            YWidget.HandlesDiv.style.position = "absolute";
            YWidget.HandlesDiv.style.left = "0px";
            YWidget.HandlesDiv.style.top = "0px";
            YWidget.HandlesDiv.style.backgroundColor = "transparent";
            YWidget.HandlesDiv.style.transformOrigin = "top left";
            YWidget.HandlesDiv.style.pointerEvents = "none";

            for (let i =0;i<9;i++)
            {  YWidget.editHandles.push(new ResizeMoveHandle(YWidget.HandlesDiv,  i,
                  (e: MouseEvent) =>
                    {if (YWidget.currentEdited != null)
                      YWidget.currentEdited.mouseStartCapture(e, i);
                    },
    (e: TouchEvent) =>
                  {if (YWidget.currentEdited != null)
                  {
                      YWidget.currentEdited.touchStartCapture(e, i);
                  }}))
            }

/*
            YWidget.TopLeftHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.TopLeftHandle);
            YWidget.TopHandleHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.TopHandleHandle);
            YWidget.TopRightHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.TopRightHandle);
            YWidget.RightHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.RightHandle);
            YWidget.BottomRightHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.BottomRightHandle);
            YWidget.BottomHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.BottomHandle);
            YWidget.BottomLeftHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.BottomLeftHandle);
            YWidget.LeftHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.LeftHandle);
            YWidget.CenterHandle = document.createElement("DIV") as HTMLDivElement;
            YWidget.editHandles.push(YWidget.CenterHandle);
            for (let i: number = 0; i < YWidget.editHandles.length; i++)
            {   let size :number  = (YWidget.HANDLESIZE - 2);
                if (i==YWidget.editHandles.length-1) size=size*2;
              //  YWidget.editHandles[i].innerHTML = YoctoVisualization.ressources.resizeHandleSVGcode(i,size,false);
                YWidget.editHandles[i].style.position = "absolute";
                YWidget.editHandles[i].style.border = "1px solid black";
                YWidget.editHandles[i].style.background = "white";
                YWidget.editHandles[i].style.pointerEvents = "auto";
                YWidget.editHandles[i].style.width = size.toString() + "px";
                YWidget.editHandles[i].style.height = size.toString() + "px";

                YWidget.HandlesDiv.appendChild(YWidget.editHandles[i]);
                YWidget.editHandles[i].addEventListener("mousedown", (e: MouseEvent) =>
                {if (YWidget.currentEdited != null)
                    YWidget.currentEdited.mouseStartCapture(e, i);
                });
                YWidget.editHandles[i].addEventListener("touchstart", (e: TouchEvent) =>
                  {if (YWidget.currentEdited != null)
                  {   console.log("touchstart")
                      YWidget.currentEdited.touchStartCapture(e, i);
                  }});
            }

            YWidget.TopLeftHandle.style.cursor = "nw-resize"
            YWidget.TopLeftHandle.style.left = "0px"
            YWidget.TopLeftHandle.style.top = "0px"

            YWidget.TopHandleHandle.style.cursor = "n-resize"
            YWidget.TopHandleHandle.style.top = "0px"
            YWidget.TopHandleHandle.style.left = "50%"
            YWidget.TopHandleHandle.style.transform = "translate(-50%,0)";

            YWidget.TopRightHandle.style.cursor = "ne-resize"
            YWidget.TopRightHandle.style.right = "0px"
            YWidget.TopRightHandle.style.top = "0px"

            YWidget.RightHandle.style.cursor = "e-resize"
            YWidget.RightHandle.style.right = "0px"
            YWidget.RightHandle.style.top = "50%"
            YWidget.RightHandle.style.transform = "translate(0,-50%)";

            YWidget.BottomRightHandle.style.cursor = "se-resize"
            YWidget.BottomRightHandle.style.right = "0px"
            YWidget.BottomRightHandle.style.bottom = "0px"

            YWidget.BottomHandle.style.cursor = "s-resize"
            YWidget.BottomHandle.style.bottom = "0px"
            YWidget.BottomHandle.style.left = "50%"
            YWidget.BottomHandle.style.transform = "translate(-50%,0)";

            YWidget.BottomLeftHandle.style.cursor = "sw-resize"
            YWidget.BottomLeftHandle.style.left = "0px"
            YWidget.BottomLeftHandle.style.bottom = "0px"

            YWidget.LeftHandle.style.cursor = "w-resize"
            YWidget.LeftHandle.style.left = "0px"
            YWidget.LeftHandle.style.top = "50%"
            YWidget.LeftHandle.style.transform = "translate(0,-50%)";

            YWidget.CenterHandle.style.cursor = "move"
            YWidget.CenterHandle.style.left = "50%"
            YWidget.CenterHandle.style.top = "50%"
            YWidget.CenterHandle.style.transform = "translate(-50%,-50%)";
*/
            document.body.appendChild(YWidget.HandlesDiv);




            document.addEventListener("touchmove", (e: TouchEvent) =>
            {
                if (YWidget.currentEdited != null)
                  YWidget.currentEdited.touchCaptureRun(e);
            },{passive:false});
            document.addEventListener("touchend", (e: TouchEvent) => {if (YWidget.currentEdited != null) YWidget.currentEdited.touchCaptureStop(e);},{passive:false});
            document.addEventListener("mousemove", (e: MouseEvent) => { if (YWidget.currentEdited != null) YWidget.currentEdited.mouseCaptureRun(e);},{passive:false})
            document.addEventListener("mouseup", (e: MouseEvent) => {if (YWidget.currentEdited != null) YWidget.currentEdited.mouseCaptureStop(e);},{passive:false})
        }
        this.DrawHandles(this.UIContainer.offsetLeft, this.UIContainer.offsetTop, this.UIContainer.offsetWidth, this.UIContainer.offsetHeight);
        YWidget.HandlesDiv.style.display = "";
        this.rearrangeZindexes();

    }

    private DrawHandles(offsetLeft: number, offsetTop: number, offsetWidth: number, offsetHeight: number): void
    {
        if (YWidget.currentEdited == null) return;
        if (YWidget.editHandles.length<=0) return;
        YWidget.HandlesDiv.style.width = offsetWidth.toString() + "px";
        YWidget.HandlesDiv.style.height = offsetHeight.toString() + "px";
        if (this._genRenderer == null) debugger
        let borderWidth: number = parseFloat(this.UIContainer.style.border);
        let borderMatrix: YDataRendering.Matrix3x3 = YDataRendering.Matrix3x3.newTranslateMatrix(-borderWidth, -borderWidth); // border compensation matrix

        YWidget.HandlesDiv.style.transform = borderMatrix.multiplyByM((<YDataRendering.YDataRenderer>this._genRenderer).Elm2ScrMatrix).toCSS();
        YWidget.HandlesDiv.style.transform = "top left";

    }
    //#endif

    protected updateWindowPositionProperties(prop: YoctoVisualization.GenericProperties): void
    {// little hack for positions not being 100% handled though properties
        prop.Form_PositionX = this.PositionX;
        prop.Form_PositionY = this.PositionY;
        prop.Form_Width = this.Width;
        prop.Form_Height = this.Height;
    }
    //#ifndef READONLY

    private previousTRansform: string = "";
    private previousWidth: number = 0;
    private previousHeight: number = 0;

    private touchStartCapture(e: TouchEvent, handleIndex: number)
    {
        if (e.touches.length == 1)
        {

            this.handleMouseStartCapture(e.touches[0].pageX, e.touches[0].pageY, handleIndex);
            e.preventDefault();
        }
    }

    private mouseStartCapture(e: MouseEvent, handleIndex: number)
    {
        if (e.button != 0) return;
        this.handleMouseStartCapture(e.pageX, e.pageY, handleIndex)
    }

    private handleMouseStartCapture(pageX: number, pageY: number, handleIndex: number)
    {
        this.resizeCaptureOriginalMatrix = (<YDataRendering.YDataRenderer>this._genRenderer).Scr2ElmMatrix;
        this.resizeCaptureOriginalMatrixInv = (<YDataRendering.YDataRenderer>this._genRenderer).Elm2ScrMatrix;
        let p: YDataRendering.Point = this.resizeCaptureOriginalMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(pageX, pageY)).toPoint();
        this.resizeCaptureRunning = true;
        this.resizeCaptureXOrigine = p.X;
        this.resizeCaptureYOrigine = p.Y;
        this.resizeCaptureOriginalLeft = this.UIContainer.offsetLeft;
        this.resizeCaptureOriginalTop = this.UIContainer.offsetTop;
        this.resizeCaptureOriginalWidth = this.UIContainer.offsetWidth;
        this.resizeCaptureOriginalHeight = this.UIContainer.offsetHeight;
        this.resizeCaptureHandleIndex = handleIndex;
        //  YWidget.editHandles[this.resizeCaptureHandleIndex].style.background = "lime";
        //let size :number = parseInt(YWidget.editHandles[this.resizeCaptureHandleIndex].style.width);
        //YWidget.editHandles[this.resizeCaptureHandleIndex].innerHTML = YoctoVisualization.ressources.resizeHandleSVGcode(this.resizeCaptureHandleIndex,size,true)
        YWidget.editHandles[this.resizeCaptureHandleIndex].active=true;
        this.previousTRansform = YWidget.HandlesDiv.style.transform;
    }

    private touchCaptureRun(e: TouchEvent): void
    {
        if (e.touches.length == 1)
        {

            this.handleCaptureRun(e.touches[0].pageX, e.touches[0].pageY);
            e.preventDefault();
        }
    }

    private mouseCaptureRun(e: MouseEvent): void
    { //console.log("mousecapturerun");
        this.handleCaptureRun(e.pageX, e.pageY);
    }

    private handleCaptureRun(pageX: number, pageY: number): void
    {
        if (!this.resizeCaptureRunning) return;
        let p: YDataRendering.Point = (<YDataRendering.Matrix3x3>this.resizeCaptureOriginalMatrix).multiplyByV(YDataRendering.Vector3.FromXYCoord(pageX, pageY)).toPoint();
        let dx: number = p.X - this.resizeCaptureXOrigine;
        let dy: number = p.Y - this.resizeCaptureYOrigine;

        let newLeft: number = this.resizeCaptureOriginalLeft
        let newTop: number = this.resizeCaptureOriginalTop;
        let newWidth: number = this.resizeCaptureOriginalWidth
        let newHeight: number = this.resizeCaptureOriginalHeight;

        switch (this.resizeCaptureHandleIndex)
        {
        case 0:
            newLeft += dx;
            newTop += dy;
            newWidth -= dx;
            newHeight -= dy;
            break  // TopLeft
        case 1:
            newTop += dy;
            newHeight -= dy;
            break  // Top
        case 2:
            newTop += dy;
            newWidth += dx;
            newHeight -= dy;
            break  // TopRight
        case 3:
            newWidth += dx;
            break  // Right
        case 4:
            newWidth += dx;
            newHeight += dy;
            break  // bottom right
        case 5:
            newHeight += dy;
            break  // bottom
        case 6:
            newLeft += dx;
            newWidth -= dx;
            newHeight += dy;
            break  // bottom left
        case 7:
            newLeft += dx;
            newWidth -= dx;
            break  //  left
        case 8:
            newLeft += dx;
            newTop += dy;
            break  // center
        }
        //if (newLeft+newWidth >  window.innerWidth)   newLeft=  window.innerWidth-newWidth; causes  more problems that it  solves
        //if (newTop+newHeight >  window.innerHeight)   newTop=  window.innerHeight-newHeight;

        // if (newTop<0)  {newHeight+=newTop; /*prevent growing */ newTop=0; }
        // if (newLeft<0) {newWidth +=newLeft; newLeft=0; }
        if (newWidth < 2 * YWidget.HANDLESIZE) newWidth = 2 * YWidget.HANDLESIZE;
        if (newHeight < 2 * YWidget.HANDLESIZE) newHeight = 2 * YWidget.HANDLESIZE;

        this.UIContainer.style.left = newLeft.toString() + "px";
        this.UIContainer.style.top = newTop.toString() + "px";

        if ((this.resizeCaptureOriginalWidth != newWidth) || (this.resizeCaptureOriginalHeight != newHeight))
        {
            this.resize(newWidth - 2, newHeight - 2) // -2 because of 1px borders
        }
        (<YDataRendering.YDataRenderer>this._genRenderer).clearTransformationMatrix();
        //this.DrawHandles(newLeft,newTop,newWidth,newHeight);
        YWidget.HandlesDiv.style.width = newWidth.toString() + "px";
        YWidget.HandlesDiv.style.height = newHeight.toString() + "px";
        YWidget.HandlesDiv.style.left = "0px";
        YWidget.HandlesDiv.style.top = "0px";
        let A: YDataRendering.Matrix3x3 = (<YDataRendering.Matrix3x3>this.resizeCaptureOriginalMatrixInv);
        let B: YDataRendering.Matrix3x3 = YDataRendering.Matrix3x3.newTranslateMatrix(newLeft - this.resizeCaptureOriginalLeft, newTop - this.resizeCaptureOriginalTop);
        let borderWidth: number = parseFloat(this.UIContainer.style.border);
        let borderMatrix: YDataRendering.Matrix3x3 = YDataRendering.Matrix3x3.newTranslateMatrix(-borderWidth, -borderWidth); // border compensation matrix
        YWidget.HandlesDiv.style.transform = borderMatrix.multiplyByM(A.multiplyByM(B)).toCSS();
    }

    protected editStopped(): void
    {
        this.resizeCaptureRunning = false;
        if (YWidget.HandlesDiv != null) YWidget.HandlesDiv.style.display = "none";
    }

    private touchCaptureStop(e: TouchEvent): void
    { this.mouseCaptureStop(null); }

    private mouseCaptureStop(e: MouseEvent | null): void
    {
        if (!this.resizeCaptureRunning) return;
        this.resizeCaptureRunning = false;
        //let size :number = parseInt(YWidget.editHandles[this.resizeCaptureHandleIndex].style.width);
        //YWidget.editHandles[this.resizeCaptureHandleIndex].innerHTML = YoctoVisualization.ressources.resizeHandleSVGcode(this.resizeCaptureHandleIndex,size,false )
        YWidget.editHandles[this.resizeCaptureHandleIndex].active=false;
        if ((this.previousTRansform != YWidget.HandlesDiv.style.transform)
            || (this.resizeCaptureOriginalWidth != this.UIContainer.offsetWidth)
            || (this.resizeCaptureOriginalHeight != this.UIContainer.offsetHeight))
        {   if (this._SizeIsRelative) this.updateRelativeSize();
            YoctoVisualization.constants.edited = true;
        }
        this.refreshProperties()

    }
//#endif

    public resize(newWidth: number, newHeight: number)
    {
        this.UIContainer.style.width = (newWidth).toString() + "px";
        this.UIContainer.style.height = (newHeight).toString() + "px";
        this.containerResized()
    }

    public containerResized(): void {}  // overloaded later on

//#ifndef READONLY
    public getContentsConfigData(): string
    {
        return "  <location x='" + this.UIContainer.offsetLeft.toString() + "' y='" + this.UIContainer.offsetTop.toString() + "'/>\n"
            + "  <size     w='" + this.UIContainer.offsetWidth.toString() + "' h='" + this.UIContainer.offsetHeight.toString() + "'  state='Normal'/>\n"
            + "  <relativeCoord x='" + this._relativePositionX.toString() + "' y='" + this._relativePositionY.toString() + "'"
            + " w='" + this._relativeWidth.toString() + "' h='" + this._relativeHeight.toString() + "'"
            + " active='" + (this._SizeIsRelative ? "True" : "False") + "'/>\n"
            + "  <container id='" + YoctoVisualization.constants.XMLquote(this._containerID) + "'/>\n"

            + this.getPropertiesXml();
    }
//#endif

    protected getPropertiesXml(): string {return "";}

    protected PatchSensorAnnotationCallback(sensor: YoctoVisualization.CustomYSensor, text: string): string
    {
        let name: string = "None";
        let avgvalue: string = "N/A";
        let minvalue: string = "N/A";
        let maxvalue: string = "N/A";
        let unit: string = "";
        if (!(sensor instanceof YoctoVisualization.NullYSensor))
        {
            let resolution: number = -Math.round(Math.log10(sensor.get_resolution()));
            name = sensor.get_friendlyName();
            if (sensor.isOnline())
            {
                avgvalue = sensor.get_lastAvgValue().toFixed(resolution);
                minvalue = sensor.get_lastMinValue().toFixed(resolution);
                maxvalue = sensor.get_lastMaxValue().toFixed(resolution);
            }
            unit = sensor.get_unit();
        }
        text = text.replace("$NAME$", name);
        text = text.replace("$AVGVALUE$", avgvalue);
        text = text.replace("$MAXVALUE$", maxvalue);
        text = text.replace("$MINVALUE$", minvalue);
        text = text.replace("$UNIT$", unit);
        return text;
    }

}

/**************************************************
 *
 * solid gauge Widget
 *
 */

export class gaugeWidget extends YWidget
{
    private _gauge: YDataRendering.YSolidGauge;
    private static AnnotationPanelCount: number = 0;
    private noDataSourcepanel: YDataRendering.MessagePanel;
    private prop: YoctoVisualization.GaugeFormProperties;

//#ifndef READONLY
    protected getPropertiesXml(): string {return this.prop.getXml(1)}
//#endif

    public containerResized(): void { if (this._gauge != null) this._gauge.containerResized() }

    public destroy(): void
    {
        this.prop.destroy();
        super.destroy();
        Object.entries(this).forEach((pair: string[]) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL

    }

    protected contextMenuIsOpening()
    {
        YoctoVisualization.YWebPage.snapshotMenuItem.userdata = this;
        YoctoVisualization.YWebPage.snapshotMenuItem.visible = true;
        YoctoVisualization.YWebPage.resetDataViewMenuItem.visible = false;
//#ifndef READONLY
        if (YoctoVisualization.YWebPage.editMenuItem == null) return;
        YoctoVisualization.YWebPage.clearDataloggerMenuItem.visible = true;
        YoctoVisualization.YWebPage.editMenuItem.caption = "Configure this gauge";
        YoctoVisualization.YWebPage.editMenuItem.visible = true;
        YoctoVisualization.YWebPage.deleteMenuItem.caption = "Delete this gauge";
        YoctoVisualization.YWebPage.deleteMenuItem.visible = true;
        YoctoVisualization.YWebPage.addMarkerMenuItem.visible = false;
        YoctoVisualization.YWebPage.disableMarkerMenuItem.visible = false;
        YoctoVisualization.YWebPage.editMenuItem.userdata = this;
        YoctoVisualization.YWebPage.deleteMenuItem.userdata = this;
//#endif
    }

    public get confirmDeleteString(): string { return "Do you really want to delete this gauge ?";}

    private AnnotationCallback(text: string): string
    {
        let sensor: YoctoVisualization.CustomYSensor = this.prop.DataSource_source;
        return this.PatchSensorAnnotationCallback(sensor, text);

    }

    constructor(node: YoctoVisualization.YXmlNode | null, editor:
//#ifndef READONLY
        YoctoVisualization.PropertiesForm2 |
//#endif
        null, x?: number, y?: number, width?: number, height?: number)
    {
        super(node, editor, x, y, width, height);
        this._gauge = new YDataRendering.YSolidGauge(this.UIContainer, YDataRendering.YSolidGauge.DisplayMode.DISPLAY90, YWidget.log);
        this._genRenderer = this._gauge;
        this.noDataSourcepanel = this._gauge.addMessagePanel();
        this.noDataSourcepanel.font.size= YoctoVisualization.constants.generalFontSize;
        this.noDataSourcepanel.text = "No data source configured\n"
            //#ifndef READONLY
            + " 1 - Make sure you have a Yoctopuce sensor connected.\n"
            + " 2 - Do a right-click or a long touch on this widget.\n"
            + " 3 - Choose \"Configure this gauge\" to bring up the properties editor.\n"
            + " 4 - Choose a data source\n"
//#endif
        ;

        this.prop = new YoctoVisualization.GaugeFormProperties(node, this);
        this._genProp = this.prop;

        let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(this.prop)
        if (gaugeWidget.AnnotationPanelCount == 0)
        {
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("SolidGauge_annotationPanel")) gaugeWidget.AnnotationPanelCount++;
            }
        }
        for (let i: number = 0; i < gaugeWidget.AnnotationPanelCount; i++)
        {
            this._gauge.addAnnotationPanel();
        }

        this._gauge.setPatchAnnotationCallback((s: string) => { return this.AnnotationCallback(s)});
        this._gauge.valueFormater = (source: YDataRendering.YDataRenderer, value: number): string => {return this.valueFormater(source, value)};
        this.updateWindowPositionProperties(this.prop);
        this.prop.ApplyAllProperties(this);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = true;
        this.prop.ApplyAllProperties(this._gauge);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = false;
        this._gauge.resetRefrenceSize();

        this._gauge.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        this.ApplyRelativeSizeIfRequired()
//#ifndef READONLY
        if (this.SizeIsRelative) this.refreshProperties()
//#endif
        this._gauge.AllowRedraw();
    }

    public valueFormater(source: YDataRendering.YDataRenderer, value: number): string
        {
        if (this.prop.DataSource_source instanceof YoctoVisualization.NullYSensor)
        {
            return "N/A";
        }
        else if (!this.prop.DataSource_source.isOnline()) return "OFFLINE";

        let format: string = this.prop.DataSource_precision;
        let p: number = format.indexOf('.');
        let n: number = 0;
        if (p >= 0) n = format.length - p - 1;
        let unit: string = this.prop.DataSource_source.get_unit();
        return value.toFixed(n) + unit;

        }

//#ifndef READONLY
    public PropertyChanged2(src: YoctoVisualization.UIElement): void
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            YoctoVisualization.GenericProperties.copyProperty_STT(this, this.prop, info.fullpropname, path);
            break;
        case "SolidGauge":
            YoctoVisualization.GenericProperties.copyProperty_STT(this._gauge, this.prop, info.fullpropname, path);
            break;
        case "DataSource":

            break;
        }
    }

    public Get_PropertyValue(src: YoctoVisualization.UIElement): any
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            return YoctoVisualization.GenericProperties.newGetProperty(this, this.prop, info.fullpropname, path, null);

        case "SolidGauge":
            return YoctoVisualization.GenericProperties.newGetProperty(this._gauge, this.prop, info.fullpropname, path, null);
        }
        return null;
    }

    public edit(): void
    {
        super.edit();
        YoctoVisualization.YWebPage.EditObject(this, this.prop,
            (src: YoctoVisualization.UIElement) => {this.PropertyChanged2(src);},
            (src: YoctoVisualization.UIElement): object => {return this.Get_PropertyValue(src);},
            () => {this.editStopped();}
        )

    }

    protected refreshProperties()
    {
        this.prop.RefreshAllProperties(this);
        this.prop.RefreshAllProperties(this._gauge);
        YoctoVisualization.YWebPage.refreshPropertiesForm();
    }
//#endif

    public SourceChanged(value: YoctoVisualization.CustomYSensor, index?: number): void
    {
        this.noDataSourcepanel.enabled = (value instanceof YoctoVisualization.NullYSensor);
        if (value instanceof YoctoVisualization.NullYSensor)
        {
            this._gauge.value = 0;
        }
        else
        {
            value.registerCallback(this);
        }
    }

    public SensorValuecallback(source: YoctoVisualization.CustomYSensor, M: YoctoAPI.YMeasure): void
    {
        if (this.prop == null) return;

        if (source == this.prop.DataSource_source)
        {
            this._gauge.value = source.isOnline() ? M.get_averageValue() : 0;
        }
    }

//#ifndef READONLY
    public getConfigData(): string
    {

        return "<GaugeForm>\n" + this.getContentsConfigData() + "</GaugeForm>\n";
    }
//#endif

}

/**************************************************
 *
 * angularGaugeWidget
 *
 */
export class angularGaugeWidget extends YWidget
{
    private _angularGauge: YDataRendering.YAngularGauge;
    private prop: YoctoVisualization.AngularGaugeFormProperties;
    private noDataSourcepanel: YDataRendering.MessagePanel;
    private static AnnotationPanelCount: number = 0;
    private static zonesCount: number = 0;
    private initDataNode: YoctoVisualization.YXmlNode | null;

//#ifndef READONLY
    protected getPropertiesXml(): string {return this.prop.getXml(1)}
//#endif

    public containerResized(): void { if (this._angularGauge != null) this._angularGauge.containerResized() }

    public destroy(): void
    {
        this.prop.destroy();
        super.destroy();

        Object.entries(this).forEach((pair: string[]) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL

    }

    private AnnotationCallback(text: string): string
    {
        let sensor: YoctoVisualization.CustomYSensor = this.prop.DataSource_source;
        return this.PatchSensorAnnotationCallback(sensor, text);
    }

    protected contextMenuIsOpening()
    {
        YoctoVisualization.YWebPage.snapshotMenuItem.userdata = this;
        YoctoVisualization.YWebPage.snapshotMenuItem.visible = true;
        YoctoVisualization.YWebPage.resetDataViewMenuItem.visible = false;
//#ifndef READONLY
        if (YoctoVisualization.YWebPage.editMenuItem == null) return;
        YoctoVisualization.YWebPage.clearDataloggerMenuItem.visible = false;
        YoctoVisualization.YWebPage.editMenuItem.caption = "Configure this gauge";
        YoctoVisualization.YWebPage.editMenuItem.visible = true;
        YoctoVisualization.YWebPage.deleteMenuItem.caption = "Delete this gauge";
        YoctoVisualization.YWebPage.deleteMenuItem.visible = true;
        YoctoVisualization.YWebPage.addMarkerMenuItem.visible = false;
        YoctoVisualization.YWebPage.disableMarkerMenuItem.visible = false;
        YoctoVisualization.YWebPage.editMenuItem.userdata = this;
        YoctoVisualization.YWebPage.deleteMenuItem.userdata = this;
//#endif
    }
    public get confirmDeleteString(): string { return "Do you really want to delete this gauge ?";}

    constructor(node: YoctoVisualization.YXmlNode | null, editor:
//#ifndef READONLY
        YoctoVisualization.PropertiesForm2 |
//#endif
        null, x?: number, y?: number, width?: number, height?: number)
    {
        super(node, editor, x, y, width, height);

        this._angularGauge = new YDataRendering.YAngularGauge(this.UIContainer, YWidget.log);
        this._genRenderer = this._angularGauge;
        this.noDataSourcepanel = this._angularGauge.addMessagePanel();
        this.noDataSourcepanel.font.size= YoctoVisualization.constants.generalFontSize;
        this.noDataSourcepanel.text = "No data source configured\n"
            //#ifndef READONLY
            + " 1 - Make sure you have a Yoctopuce sensor connected.\n"
            + " 2 - Do a right-click  or a long touch on this widget.\n"
            + " 3 - Choose \"Configure this gauge\" to bring up the properties editor.\n"
            + " 4 - Choose a data source\n"
//#endif
        ;

        this.prop = new YoctoVisualization.AngularGaugeFormProperties(node, this);
        this._genProp = this.prop;
        let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(this.prop)
        if (angularGaugeWidget.AnnotationPanelCount == 0)
        {
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("AngularGauge_annotationPanel")) angularGaugeWidget.AnnotationPanelCount++;
                if (propname.startsWith("AngularGauge_zone")) angularGaugeWidget.zonesCount++;
            }
        }

        for (let i: number = 0; i < angularGaugeWidget.zonesCount; i++)
        {
            this._angularGauge.AddZone();
        }

        for (let i: number = 0; i < angularGaugeWidget.AnnotationPanelCount; i++)
        {
            this._angularGauge.addAnnotationPanel();
        }

        this._angularGauge.setPatchAnnotationCallback((s: string) => { return this.AnnotationCallback(s)});

        this.initDataNode = node;
        this.updateWindowPositionProperties(this.prop);
        this.prop.ApplyAllProperties(this);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = true;
        this.prop.ApplyAllProperties(this._angularGauge);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = false;
        this._angularGauge.resetRefrenceSize();
        this._angularGauge.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        this.ApplyRelativeSizeIfRequired()
//#ifndef READONLY
        if (this.SizeIsRelative) this.refreshProperties()
//#endif
        this._angularGauge.AllowRedraw();
    }

//#ifndef READONLY
    public PropertyChanged2(src: YoctoVisualization.UIElement): void
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            YoctoVisualization.GenericProperties.copyProperty_STT(this, this.prop, info.fullpropname, path);
            break;
        case "AngularGauge":
            YoctoVisualization.GenericProperties.copyProperty_STT(this._angularGauge, this.prop, info.fullpropname, path);
            break;
        case "DataSource":

            break;
        }
    }

    public Get_PropertyValue(src: YoctoVisualization.UIElement): any
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            return YoctoVisualization.GenericProperties.newGetProperty(this, this.prop, info.fullpropname, path, null);

        case "AngularGauge":
            return YoctoVisualization.GenericProperties.newGetProperty(this._angularGauge, this.prop, info.fullpropname, path, null);
        }
        return null;
    }

    public edit(): void
    {
        super.edit();
        YoctoVisualization.YWebPage.EditObject(this, this.prop,
            (src: YoctoVisualization.UIElement) => {this.PropertyChanged2(src);},
            (src: YoctoVisualization.UIElement): object => {return this.Get_PropertyValue(src);},
            () => {this.editStopped();}
        )
    }

    protected refreshProperties()
    {
        this.prop.RefreshAllProperties(this);
        this.prop.RefreshAllProperties(this._angularGauge);
        YoctoVisualization.YWebPage.refreshPropertiesForm();
    }
//#endif

    private showStatus(status: string): void
    {
        if (status != "") this._angularGauge.value = 0;
        this._angularGauge.showNeedle = status == "";
        this._angularGauge.statusLine = status;
    }

    public SourceChanged(value: YoctoVisualization.CustomYSensor, index?: number): void
    {
        this._angularGauge.DisableRedraw();
        this.noDataSourcepanel.enabled = (value instanceof YoctoVisualization.NullYSensor);
        if (value instanceof YoctoVisualization.NullYSensor)
        {
            this.showStatus("N/A");
            this._angularGauge.unit = "";
        }
        else if (!value.isOnline())
        {
            this.showStatus("OFFLINE");
        }
        else
        {
            this.showStatus("");
            this._angularGauge.unit = value.get_unit();
        }
        this._angularGauge.AllowRedraw();
        value.registerCallback(this);

    }

    public SensorValuecallback(source: YoctoVisualization.CustomYSensor, M: YoctoAPI.YMeasure): void
    {
        if (this.prop == null) return;
        if (source == this.prop.DataSource_source)
        {
            this._angularGauge.DisableRedraw();
            if (this.prop.DataSource_source instanceof YoctoVisualization.NullYSensor)
            {
                this.showStatus("N/A");
                this._angularGauge.unit = "";
            }
            else if (!this.prop.DataSource_source.isOnline())
            {
                this.showStatus("OFFLINE");
            }
            else
            {
                this._angularGauge.DisableRedraw();
                this.showStatus("");
                // source.get_unit();  // make sure unit is in cache before UI is refresh (redraw might call value formatter, which  will call get_unit)
                this._angularGauge.unit = source.get_unit();
                this._angularGauge.value = M.get_averageValue();
                this._angularGauge.AllowRedraw();
            }
            this._angularGauge.AllowRedraw();
        }
    }

//#ifndef READONLY
    public getConfigData(): string
    {

        return "<angularGaugeForm>\n" + this.getContentsConfigData() + "</angularGaugeForm>\n";
    }
//#endif
}

/**************************************************
 *
 * digitalDisplayWidget
 *
 */

export class digitalDisplayWidget extends YWidget
{
    private _display: YDataRendering.YDigitalDisplay;
    private prop: YoctoVisualization.digitalDisplayFormProperties;
    private noDataSourcepanel: YDataRendering.MessagePanel;
    private static AnnotationPanelCount: number = 0;
    private _unit = "";

//#ifndef READONLY
    protected getPropertiesXml(): string {return this.prop.getXml(1)}
//#endif

    public containerResized(): void { if (this._display != null) this._display.containerResized() }

    public destroy(): void
    {
        this.prop.destroy();
        super.destroy();
        Object.entries(this).forEach((pair: string[]) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL

    }

    private AnnotationCallback(text: string): string
    {
        let sensor: YoctoVisualization.CustomYSensor = this.prop.DataSource_source;
        return this.PatchSensorAnnotationCallback(sensor, text);
    }

    protected contextMenuIsOpening()
    {
        YoctoVisualization.YWebPage.snapshotMenuItem.userdata = this;
        YoctoVisualization.YWebPage.snapshotMenuItem.visible = true;
        YoctoVisualization.YWebPage.resetDataViewMenuItem.visible = false;
//#ifndef READONLY
        if (YoctoVisualization.YWebPage.editMenuItem == null) return;
        YoctoVisualization.YWebPage.clearDataloggerMenuItem.visible = false;
        YoctoVisualization.YWebPage.editMenuItem.caption = "Configure this digital display";
        YoctoVisualization.YWebPage.editMenuItem.visible = true;
        YoctoVisualization.YWebPage.deleteMenuItem.caption = "Delete this digital display";
        YoctoVisualization.YWebPage.deleteMenuItem.visible = true;
        YoctoVisualization.YWebPage.addMarkerMenuItem.visible = false;
        YoctoVisualization.YWebPage.disableMarkerMenuItem.visible = false;
        YoctoVisualization.YWebPage.editMenuItem.userdata = this;
        YoctoVisualization.YWebPage.deleteMenuItem.userdata = this;
//#endif
    }

    public get confirmDeleteString(): string { return "Do you really want to delete this digital display ?";}

    constructor(node: YoctoVisualization.YXmlNode | null, editor:
//#ifndef READONLY
        YoctoVisualization.PropertiesForm2 |
//#endif
        null, x?: number, y?: number, width?: number, height?: number)
    {
        super(node, editor, x, y, width, height);
        this._display = new YDataRendering.YDigitalDisplay(this.UIContainer, YWidget.log);
        this._genRenderer = this._display;
        this.noDataSourcepanel = this._display.addMessagePanel();
        this.noDataSourcepanel.font.size= YoctoVisualization.constants.generalFontSize;
        this.noDataSourcepanel.text = "No data source configured\n"
            //#ifndef READONLY
            + " 1 - Make sure you have a Yoctopuce sensor connected.\n"
            + " 2 - Do a right-click  or a long touch on this widget.\n"
            + " 3 - Choose \"Configure this digital display\" to bring up the properties editor.\n"
            + " 4 - Choose a data source\n"
//#endif
        ;

        this.prop = new YoctoVisualization.digitalDisplayFormProperties(node, this);
        this._genProp = this.prop;
        let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(this.prop)
        if (digitalDisplayWidget.AnnotationPanelCount == 0)
        {
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("display_annotationPanel")) digitalDisplayWidget.AnnotationPanelCount++;

            }
        }

        for (let i: number = 0; i < digitalDisplayWidget.AnnotationPanelCount; i++)
        {
            this._display.addAnnotationPanel();
        }
        this._display.setPatchAnnotationCallback((s: string) => { return this.AnnotationCallback(s)});
        this._display.valueFormater = (source: YDataRendering.YDataRenderer, value: number): string => {return this.valueFormater(source, value)};

        this.updateWindowPositionProperties(this.prop);
        this.prop.ApplyAllProperties(this);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = true;
        this.prop.ApplyAllProperties(this._display);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = false;

        this._display.resetRefrenceSize();
        this._display.AllowPrintScreenCapture = true;

        this._display.resetRefrenceSize();
        this._display.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        this.ApplyRelativeSizeIfRequired()
//#ifndef READONLY
        if (this.SizeIsRelative) this.refreshProperties()
//#endif
        this._display.AllowRedraw();
    }

    public valueFormater(source: YDataRendering.YDataRenderer, value: number): string
    {
        if (this.prop.DataSource_source instanceof YoctoVisualization.NullYSensor)
        {
            return "N/A";
        }
        else if (!this.prop.DataSource_source.isOnline()) return "OFFLINE";

        let format: string = this.prop.DataSource_precision;
        let p: number = format.indexOf('.');
        let n: number = 0;
        if (p >= 0) n = format.length - p - 1;
        let unit: string = this.prop.DataSource_source.get_unit();
        return value.toFixed(n) + unit;

    }

//#ifndef READONLY
    public PropertyChanged2(src: YoctoVisualization.UIElement): void
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);

        switch (info.propType)
        {
        case "Form":
            YoctoVisualization.GenericProperties.copyProperty_STT(this, this.prop, info.fullpropname, path);
            break;
        case "display":
            YoctoVisualization.GenericProperties.copyProperty_STT(this._display, this.prop, info.fullpropname, path);
            break;
        case "DataSource":

            break;
        }
    }

    public Get_PropertyValue(src: YoctoVisualization.UIElement): any
    {

        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            return YoctoVisualization.GenericProperties.newGetProperty(this, this.prop, info.fullpropname, path, null);

        case "display":
            return YoctoVisualization.GenericProperties.newGetProperty(this._display, this.prop, info.fullpropname, path, null);
        }
        return null;

    }

    public edit(): void
    {
        super.edit();
        YoctoVisualization.YWebPage.EditObject(this, this.prop,
            (src: YoctoVisualization.UIElement) => {this.PropertyChanged2(src);},
            (src: YoctoVisualization.UIElement): object => {return this.Get_PropertyValue(src);},
            () => {this.editStopped();}
        )

    }

    protected refreshProperties()
    {
        this.prop.RefreshAllProperties(this);
        this.prop.RefreshAllProperties(this._display);
        YoctoVisualization.YWebPage.refreshPropertiesForm();
    }
//#endif

    public SourceChanged(value: YoctoVisualization.CustomYSensor, index?: number): void
    {
        this.noDataSourcepanel.enabled = (value instanceof YoctoVisualization.NullYSensor);
        this.SensorValuecallback(value, null);
        if (value instanceof YoctoVisualization.NullYSensor)
        {
            this._display.alternateValue = "N/A";
        }
        else if (!value.isOnline()) this._display.alternateValue = "OFFLINE";
        value.registerCallback(this);

    }

    public SensorValuecallback(source: YoctoVisualization.CustomYSensor, M: YoctoAPI.YMeasure | null): void
    {
        if (this.prop == null) return;
        if (this.prop.DataSource_source instanceof YoctoVisualization.NullYSensor)
        {
            this._display.alternateValue = "N/A";
        }
        else if (!this.prop.DataSource_source.isOnline())
        {
            this._display.alternateValue = "OFFLINE";
        }
        else if (M == null)
        {
            this._display.alternateValue = "--" + this._unit;
        }
        else if (source == this.prop.DataSource_source)
        {
            this._display.DisableRedraw();
            // source.get_unit();  // make sure unit is in cache before UI is refresh (redraw might call value formatter, which  will call get_unit)
            this._display.alternateValue = null;
            this._display.value = M.get_averageValue();
            this._display.AllowRedraw();
        }
    }

//#ifndef READONLY
    public getConfigData(): string
    {

        return "<digitalDisplayForm>\n" + this.getContentsConfigData() + "</digitalDisplayForm>\n";
    }
//#endif
}

/**************************************************
 *
 * graph Widget
 *
 */

export class graphWidget extends YWidget
{
    private _graph: YDataRendering.YGraph;

    private noDataSourcepanel: YDataRendering.MessagePanel;
    private offLineSourcesPanel: YDataRendering.MessagePanel;
    private captureRunningPanel: YDataRendering.MessagePanel;
    private dataloggerProgress: YDataRendering.MessagePanel;
    private prop: YoctoVisualization.GraphFormProperties;
    private markers: YDataRendering.Marker[];
    private seriesProperties: YoctoVisualization.ChartSerie[]
    private static AnnotationPanelCount: number = 0;
    private static SeriesCount: number = 0;
    private static ZoneCountPerYaxis: number = 0;
    private static MarkerCountPerXaxis: number = 0;
    private static YAxisCount: number = 0
    private static DataLoggerLoadingMsg : string="Loading from datalogger";

    private offlineMessages: String[];
    private showOffline: boolean[];

    private AnnotationCallback(text: string): string
    {
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + i.toString());
            let sensor: YoctoVisualization.CustomYSensor = s.DataSource_source;
            let name: string = "None";
            let avgvalue: string = "N/A";
            let minvalue: string = "N/A";
            let maxvalue: string = "N/A";
            let unit: string = "";
            if (!(sensor instanceof YoctoVisualization.NullYSensor))
            {
                let resolution: number = -Math.round(Math.log10(sensor.get_resolution()));
                name = s.legend != "" ? s.legend : sensor.get_friendlyName();
                if (sensor.isOnline())
                {
                    avgvalue = sensor.get_lastAvgValue().toFixed(resolution);
                    minvalue = sensor.get_lastMinValue().toFixed(resolution);
                    maxvalue = sensor.get_lastMaxValue().toFixed(resolution);
                }
                unit = sensor.get_unit();
            }
            text = text.replace("$NAME" + (i + 1).toString() + "$", name);
            text = text.replace("$AVGVALUE" + (i + 1).toString() + "$", avgvalue);
            text = text.replace("$MAXVALUE" + (i + 1).toString() + "$", maxvalue);
            text = text.replace("$MINVALUE" + (i + 1).toString() + "$", minvalue);
            text = text.replace("$UNIT" + (i + 1).toString() + "$", unit);
        }
        return text;
    }
    public destroy(): void
    {
        this.prop.destroy();
        super.destroy();
        Object.entries(this).forEach((pair: string[]) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL
    }

//#ifndef READONLY
    protected getPropertiesXml(): string {return this.prop.getXml(1)}
//#endif

    public containerResized(): void { if (this._graph != null) this._graph.containerResized(); }

    protected contextMenuIsOpening()
    {
        YoctoVisualization.YWebPage.snapshotMenuItem.userdata = this;
        YoctoVisualization.YWebPage.snapshotMenuItem.visible = true;
        YoctoVisualization.YWebPage.resetDataViewMenuItem.visible = true;
        YoctoVisualization.YWebPage.resetDataViewMenuItem.userdata = this;
//#ifndef READONLY
        if (YoctoVisualization.YWebPage.editMenuItem == null) return;
        YoctoVisualization.YWebPage.clearDataloggerMenuItem.visible = true;
        YoctoVisualization.YWebPage.clearDataloggerMenuItem.userdata = this;
        YoctoVisualization.YWebPage.editMenuItem.caption = "Configure this graph";
        YoctoVisualization.YWebPage.editMenuItem.visible = true;
        YoctoVisualization.YWebPage.deleteMenuItem.caption = "Delete this graph";
        YoctoVisualization.YWebPage.deleteMenuItem.visible = true;
        YoctoVisualization.YWebPage.addMarkerMenuItem.visible = true;
        YoctoVisualization.YWebPage.disableMarkerMenuItem.visible = true;
        YoctoVisualization.YWebPage.editMenuItem.userdata = this;
        YoctoVisualization.YWebPage.deleteMenuItem.userdata = this;
        YoctoVisualization.YWebPage.disableMarkerMenuItem.userdata = this;
        for (let i: number = 0; i < YoctoVisualization.YWebPage.markersSubMenuItems.length; i++)
        {
            YoctoVisualization.YWebPage.markersSubMenuItems[i].caption = "Place marker #" + (i + 1).toString();
            YoctoVisualization.YWebPage.markersSubMenuItems[i].userdata = this;
        }
//#endif
    }

    public startMarkerCapture(markerIndex: number)
    {
        this.markers[markerIndex].startCapture();
    }

    public AxisParamtersChangedAutomatically(source: YDataRendering.GenericAxis): void
    {
        let yaxis: YoctoVisualization.YaxisDescription = source.userData as YoctoVisualization.YaxisDescription
        yaxis.visible = source.visible;
//#ifndef READONLY
        YoctoVisualization.YWebPage.refreshPropertiesForm()
//#endif
    }

//#ifndef READONLY
    public get confirmDeleteString(): string { return "Do you really want to delete this graph ?";}
//#endif

    constructor(node: YoctoVisualization.YXmlNode | null, editor:
//#ifndef READONLY
        YoctoVisualization.PropertiesForm2 |
//#endif
        null, x?: number, y?: number, width?: number, height?: number)
    {
        super(node, editor, x, y, width, height);

        this._graph = new YDataRendering.YGraph(this.UIContainer, YWidget.log);

        this.noDataSourcepanel = this._graph.addMessagePanel();
        this.noDataSourcepanel.font.size= YoctoVisualization.constants.generalFontSize;
        this.noDataSourcepanel.text = "No data source configured\n"
            //#ifndef READONLY
            + " 1 - Make sure you have a Yoctopuce sensor connected.\n"
            + " 2 - Do a right-click  or a long touch on this widget.\n"
            + " 3 - Choose \"Configure this graph\" to bring up the properties editor.\n"
            + " 4 - Choose a data source\n"
//#endif
        ;

        this.dataloggerProgress               = this._graph.addMessagePanel();
        this.dataloggerProgress.font.size     = (12 * YoctoVisualization.constants.guiDPIFactor);
        this.dataloggerProgress.font.color    = YDataRendering.YColor.DarkGray;
        this.dataloggerProgress.borderColor   = YDataRendering.YColor.Gray;
        this.dataloggerProgress.panelHrzAlign = YDataRendering.MessagePanel.HorizontalAlignPos.LEFT;
        this.dataloggerProgress.panelVrtAlign = YDataRendering.MessagePanel.VerticalAlignPos.TOP;
        this.dataloggerProgress.text          = graphWidget.DataLoggerLoadingMsg;
        this.dataloggerProgress.enabled       = false ;

        this.prop = new YoctoVisualization.GraphFormProperties(node, this);
        this._genProp = this.prop;
        let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(this.prop)
        if (graphWidget.YAxisCount == 0)
        {
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("Graph_annotationPanel")) graphWidget.AnnotationPanelCount++;

                if (propname.startsWith("Graph_series")) graphWidget.SeriesCount++;
                if (propname.startsWith("Graph_yAxes")) graphWidget.YAxisCount++;
            }
        }

        if (graphWidget.ZoneCountPerYaxis == 0)
        {
            let yAxisProp = new YoctoVisualization.YaxisDescription(0, false);
            let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(yAxisProp)
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("zones")) graphWidget.ZoneCountPerYaxis++;
            }
        }

        if (graphWidget.MarkerCountPerXaxis == 0)
        {
            let xAxisProp = new YoctoVisualization.XaxisDescription();
            let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(xAxisProp)
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("markers")) graphWidget.MarkerCountPerXaxis++;
            }
        }

        this.offLineSourcesPanel = this._graph.addMessagePanel();
        this.offLineSourcesPanel.bgColor = YDataRendering.YColor.FromArgb(192, 255, 192, 192);
        this.offLineSourcesPanel.borderColor = YDataRendering.YColor.DarkRed;
        this.offLineSourcesPanel.font.color = YDataRendering.YColor.DarkRed;
        this.offLineSourcesPanel.panelHrzAlign = YDataRendering.MessagePanel.HorizontalAlignPos.RIGHT;
        this.offLineSourcesPanel.panelVrtAlign = YDataRendering.MessagePanel.VerticalAlignPos.TOP;

        this.captureRunningPanel = this._graph.addMessagePanel();
        this.captureRunningPanel.bgColor = YDataRendering.YColor.FromArgb(240, 200, 255, 193);
        this.captureRunningPanel.borderColor = YDataRendering.YColor.DarkGreen;
        this.captureRunningPanel.font.color = YDataRendering.YColor.DarkGreen;
        this.captureRunningPanel.panelHrzAlign = YDataRendering.MessagePanel.HorizontalAlignPos.LEFT;
        this.captureRunningPanel.panelVrtAlign = YDataRendering.MessagePanel.VerticalAlignPos.TOP;

        for (let i: number = 0; i < graphWidget.YAxisCount; i++)
        {
            let axis: YDataRendering.YAxis = this._graph.addYAxis();

            for (let j: number = 0; j < graphWidget.ZoneCountPerYaxis; j++)
            {
                axis.AddZone();
            }
        }

        this.markers = [];
        for (let i: number = 0; i < graphWidget.MarkerCountPerXaxis; i++)
        {
            let m: YDataRendering.Marker = this._graph.xAxis.AddMarker();
            m.xposition = YDataRendering.TimeConverter.ToUnixTime(new Date()) + i * 60; // not really sure
            this.markers.push(m);
        }

        for (let i: number = 0; i < graphWidget.AnnotationPanelCount; i++)
        {
            this._graph.addAnnotationPanel();
        }

        this.seriesProperties = [];
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {

            this.seriesProperties.push(Reflect.get(this.prop, "Graph_series" + i.toString()));
            this._graph.addSerie();
        }
        this._graph.yAxes[0].visible = true;

        this._graph.setPatchAnnotationCallback((s: string) => { return this.AnnotationCallback(s)});
        this._genRenderer = this._graph;
        this._graph.resetRefrenceSize();
        this._graph.AllowPrintScreenCapture = true;

//#ifndef READONLY
        this._graph.setMarkerCaptureCallbacks((m: YDataRendering.Marker) => {this.MarkedCaptureStarted(m)},
            (m: YDataRendering.Marker | null) => {this.MarkedCaptureStopped(m)});
//#endif
        this.offlineMessages = new Array(graphWidget.SeriesCount);
        this.showOffline = new Array(graphWidget.SeriesCount);

        this.updateWindowPositionProperties(this.prop);

        this.prop.ApplyAllProperties(this);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = true;
        this.prop.ApplyAllProperties(this._graph);
        YDataRendering.YDataRenderer.minMaxCheckDisabled = false;

        for (let i: number = 0; i < graphWidget.YAxisCount; i++)
        {
            this._graph.yAxes[i].AxisChanged = () => {this.AxisParamtersChangedAutomatically(this._graph.yAxes[i]);}
            this._graph.yAxes[i].AllowAutoShow = true;
        }

        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + i.toString()) as YoctoVisualization.ChartSerie;
            s.Init(this, i);
            if (s.DataSource_source != null)
            {
                this.SourceChanged(s.DataSource_source, i);
            }
        }

        this._graph.resetRefrenceSize();
        this._graph.resizeRule = YDataRendering.Proportional.ResizeRule.FIXED;
        this.ApplyRelativeSizeIfRequired()
//#ifndef READONLY
        if (this.SizeIsRelative) this.refreshProperties()
//#endif
        this.loadRecordedDataIfNeeded()
        this._graph.AllowRedraw();
    }

//#ifndef READONLY

    private editedMarkerWasEnabled: boolean = false;
    private editedMarkerPosition: number = 0;

    private MarkedCaptureStarted(src: YDataRendering.Marker): void
    {
        let str: string = (src.text != "") ? "Click to place the \"" + src.shortText + "\" marker." : "Click to place the marker.";
        str += "\nRight-click to cancel the operation.";
        this.editedMarkerWasEnabled = src.enabled;
        this.editedMarkerPosition = src.positionOnXAxis.value;

        this.captureRunningPanel.text = str;
        this.captureRunningPanel.enabled = true;
    }

    private MarkedCaptureStopped(src: YDataRendering.Marker | null): void
    {
        if (src != null)
        {
            if ((this.editedMarkerWasEnabled != src.enabled) && (this.editedMarkerPosition != src.positionOnXAxis.value))
            {
                YoctoVisualization.constants.edited = true;
            }
        }
        this.captureRunningPanel.enabled = false;
        this.refreshProperties()
    }

    protected refreshProperties()
    {
        this.prop.RefreshAllProperties(this);
        this.prop.RefreshAllProperties(this._graph);
        YoctoVisualization.YWebPage.refreshPropertiesForm();
    }
//#endif

    private decomposeToSegments(data: YoctoVisualization.TimedSensorValue[], start: number, dataCount: number): YDataRendering.pointXY[][]
    {
        let n1: number = start;
        let n2: number = 0;
        let l: YDataRendering.pointXY[][] = [];
        let deltaT: number = 0;
        while (n1 < start + dataCount - 1)
        {
            try
            { deltaT = data[n1 + 1].DateTime - data[n1].DateTime; }
            catch (Exception)
            { debugger}
            n2 = n1 + 1;
            while ((n2 < dataCount) && (data[n2].DateTime - data[n2 - 1].DateTime < 2 * deltaT))
            {
                n2++;
            }
            let count: number = n2 - n1;
            if (count > 0)
            {
                let p: YDataRendering.pointXY[] = new Array(count);
                for (let i: number = 0; i < count; i++)
                {
                    p[i] = new YDataRendering.pointXY(data[n1 + i].DateTime, data[n1 + i].value);
                }
                l.push(p);
            }
            n1 = n2;
        }
        return l;
    }

    public SourceChanged(value: YoctoVisualization.CustomYSensor, index: number)
    {
        this._graph.DisableRedraw();
        let s: YoctoVisualization.ChartSerie;
        let noDataSource: boolean = true;
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            s = Reflect.get(this.prop, "Graph_series" + i.toString()) as YoctoVisualization.ChartSerie;
            if (!(s.DataSource_source instanceof YoctoVisualization.NullYSensor)) noDataSource = false;
        }
        this.noDataSourcepanel.enabled = noDataSource;

        if (value != null)
        {
            if (!(value instanceof YoctoVisualization.NullYSensor))
            {
                if (value.isOnline())
                {
                    this.showOffline[index] = false;
                }
                else
                {
                    this.offlineMessages[index] = value.get_friendlyName() + " is OFFLINE";
                    this.showOffline[index] = true;
                    YoctoVisualization.logForm.log(value.get_friendlyName() + " is OFFLINE");
                }
            }
            else
            {
                this.showOffline[index] = false;
            }
        }
        else
        {
            this.showOffline[index] = false;
        }
        this.updateOfflinePanel();
        this.preLoadSensorData(value, index);
        this.loadRecordedDataIfNeeded();
        if (value) value.registerCallback(this);
        this._graph.AllowRedraw();


    }


    public SensorArrivalcallback(source: YoctoVisualization.CustomYSensor)
    {   this.loadRecordedDataIfNeeded();

    }

    private preLoadSensorData(value: YoctoVisualization.CustomYSensor, index: number): void
    {
        if (value instanceof YoctoVisualization.NullYSensor)
        {
            this._graph.series[index].clear();
            return;
        }
        let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + index.toString()) as YoctoVisualization.ChartSerie;
        let data: YoctoVisualization.TimedSensorValue[];
        switch (s.DataSource_datatype)
        {
        case 1:
            data = value.minData;
            break;
        case 2:
            data = value.maxData;
            break;
        default:
            data = value.curData;
            break;
        }
        let l: YDataRendering.pointXY[][] = this.decomposeToSegments(data, 0, data.length);
        this._graph.series[index].clear();
        for (let i: number = l.length - 1; i >= 0; i--)
        {
            this._graph.series[index].InsertPoints(l[i]);
        }
        this._graph.series[index].rebuildSummaries();
    }

//#ifndef READONLY
    public PropertyChanged2(src: YoctoVisualization.UIElement): void
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            YoctoVisualization.GenericProperties.copyProperty_STT(this, this.prop, info.fullpropname, path);
            break;
        case "Graph":
            YoctoVisualization.GenericProperties.copyProperty_STT(this._graph, this.prop, info.fullpropname, path);
            break;
        case "DataSource":

            break;
        }
    }

    public Get_PropertyValue(src: YoctoVisualization.UIElement): any
    {
        let info: YoctoVisualization.PropPathinfo = new YoctoVisualization.PropPathinfo();
        let path: string[] = src.ExtractPropPath(info);
        switch (info.propType)
        {
        case "Form":
            return YoctoVisualization.GenericProperties.newGetProperty(this, this.prop, info.fullpropname, path, null);
        case "Graph":
            return YoctoVisualization.GenericProperties.newGetProperty(this._graph, this.prop, info.fullpropname, path, null);
        case "DataSource":
            return null;
        }
        return null;

    }

    public edit(): void
    {
        super.edit();
        YoctoVisualization.YWebPage.EditObject(this, this.prop,
            (src: YoctoVisualization.UIElement) => {this.PropertyChanged2(src);},
            (src: YoctoVisualization.UIElement): object => {return this.Get_PropertyValue(src);},
            () => {this.editStopped();}
        )

    }
//#endif

    private updateOfflinePanel(): void
    {
        let message: string = "";
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            if (this.showOffline[i]) message = message + ((message != "") ? "\n" : "") + this.offlineMessages[i];
        }
        if (message == "" && this.offLineSourcesPanel.enabled) this.offLineSourcesPanel.enabled = false;
        if (message != "" && ((this.offLineSourcesPanel.text != message) || (!this.offLineSourcesPanel.enabled)))
        {
            this.offLineSourcesPanel.text = message;
            this.offLineSourcesPanel.enabled = true;
        }
    }

    public SensorValuecallback(source: YoctoVisualization.CustomYSensor, M: YoctoAPI.YMeasure): void
    {
        if (this.prop == null) return;
        //     if (FirstLiveValue == 0) FirstLiveValue = M.get_endTimeUTC();
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            let s: YoctoVisualization.ChartSerie = this.seriesProperties[i];
            if (s.DataSource_source == source)
            {
                if (!s.DataSource_source.isOnline())
                {
                    this.offlineMessages[i] = s.DataSource_source.get_friendlyName() + " is OFFLINE";
                    this.showOffline[i] = true;
                    this.updateOfflinePanel();
                    return;
                }
                this.showOffline[i] = false;
                this.updateOfflinePanel();
                let index: number = s.DataSource_source.curData.length - 1;
                if (index>=0)
                  switch (s.DataSource_datatype)
                  {
                    case 1  :
                      this._graph.series[i].AddPoint(new YDataRendering.pointXY(s.DataSource_source.minData[index].DateTime, s.DataSource_source.minData[index].value));
                      break;
                    case 2  :
                      this._graph.series[i].AddPoint(new YDataRendering.pointXY(s.DataSource_source.maxData[index].DateTime, s.DataSource_source.maxData[index].value));
                      break;
                    default :
                      this._graph.series[i].AddPoint(new YDataRendering.pointXY(s.DataSource_source.curData[index].DateTime, s.DataSource_source.curData[index].value));
                      break;
                }
                this._graph.series[i].unit = s.DataSource_source.get_unit();
            }
        }
    }

    public disableAllMarkers(): void
    {
        YoctoVisualization.confirm.ask("Do you really want to disable all markers?",
            () =>
            {
                for (let i: number = 0; i < this.markers.length; i++)
                {
                    this.markers[i].enabled = false;
                }
            },
            () => {}, null);
    }

    public clearDataLogger(): void
    {
        YoctoVisualization.confirm.ask("Do you really want to erase contents of all dataloggers related to this graph?",
            () => {this.startToClearDataLoggers()},
            () => {}, null);
    }

    private truncateView(): void
    {
        //FirstLiveValue = now();
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            this._graph.series[i].clear();
        }

        let FirstLiveValue: number = Math.floor((new Date()).getTime() / 1000);
        this._graph.xAxis.set_minMax(FirstLiveValue, FirstLiveValue + this._graph.xAxis.initialZoom);
    }

    public resetDataView()
    {
        this.prop.Graph_showRecordedData = false;
        this.truncateView();
        //mainForm.refreshPropertiesForm();
    }

    private async startToClearDataLoggers()
    {

        let loggers: YoctoAPI.YDataLogger[] = [];
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + i.toString());
            let sensor: YoctoVisualization.CustomYSensor = s.DataSource_source;
            if (!(sensor instanceof YoctoVisualization.NullYSensor))
            {
                sensor.stopDataloggerloading();
                let serial: string = sensor.get_hardwareId();
                let n: number = serial.indexOf(".");
                serial = serial.substring(0, n);
                let d: YoctoAPI.YDataLogger = await YoctoAPI.YDataLogger.FindDataLogger(serial + ".dataLogger");
                if (await d.isOnline())
                {
                    let found: boolean = false;
                    for (let j: number = 0; j < loggers.length; j++)
                    {
                        if (loggers[j] == d) found = true;
                    }
                    if (!found) loggers.push(d);
                }
            }
        }

        for (let i: number = 0; i < loggers.length; i++)
        {
            await loggers[i].forgetAllDataStreams();
            await loggers[i].set_recording(YoctoAPI.YDataLogger.RECORDING_ON);
        }
        let tmp: boolean = this.prop.Graph_showRecordedData;
        this.prop.Graph_showRecordedData = false;
        this.truncateView();
        this.prop.Graph_showRecordedData = tmp;

    }

    public dataLoggerLoadprocessIsRunningNotification (  source : YoctoVisualization.CustomYSensor)
    { let loadTotalPercent  =0;
      let sensorCount  =0;
      if (!this.prop.Graph_showRecordedData) return;

        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {    let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + i.toString());
             let sensor: YoctoVisualization.CustomYSensor = s.DataSource_source;
             if  (sensor.dataloggerLoadisRunning)
             {  loadTotalPercent += sensor.dataloggerLoadProgress;
                 sensorCount++
             }
        }
        if (sensorCount>0) this.dataloggerProgress.text  = graphWidget.DataLoggerLoadingMsg+" (" + (loadTotalPercent / sensorCount).toFixed(0) + "%)"
        //console.log(loadTotalPercent);

        let showPanel : boolean = (sensorCount>0) && (loadTotalPercent>0) && (loadTotalPercent<sensorCount*100)
       // console.log("sensorCount="+sensorCount+"  loadTotalPercent="+ loadTotalPercent);
       // if  (!showPanel)   debugger
        this.dataloggerProgress.enabled = showPanel   ;

    }

    /*
    public startDataPreload(source: YoctoVisualization.CustomYSensor)
        {

           if (!this.prop.Graph_showRecordedData)
           {
              this.dataloggerProgress.enabled=false;
              return;
          }
            this.dataloggerProgress.enabled=true;

        }

     */

    public SensorNewDataBlock(source: YoctoVisualization.CustomYSensor, sourceFromIndex: number, sourcetoIndex: number, targetIndex: number, fromDataLogger: boolean): void
    {
        if (this.prop == null) return;
        if ((fromDataLogger) && (!this.prop.Graph_showRecordedData)) return;
        let l: YDataRendering.pointXY[][] | null = null;
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {
            let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + i.toString());
            if (s.DataSource_source == source)
            {
                let count: number = sourcetoIndex - sourceFromIndex + 1;

                if (count > 1)
                {
                    switch (s.DataSource_datatype)
                    {
                    case 1:
                        l = this.decomposeToSegments(s.DataSource_source.minData, sourceFromIndex, count);
                        for (let j: number = l.length - 1; j >= 0; j--)
                        {
                            this._graph.series[i].InsertPoints(l[j]);
                        }
                        break;
                    case 2:
                        l = this.decomposeToSegments(s.DataSource_source.maxData, sourceFromIndex, count);
                        for (let j: number = l.length - 1; j >= 0; j--)
                        {
                            this._graph.series[i].InsertPoints(l[j]);
                        }
                        break;
                    default:
                        l = this.decomposeToSegments(s.DataSource_source.curData, sourceFromIndex, count);
                        for (let j: number = l.length - 1; j >= 0; j--)
                        {
                            this._graph.series[i].InsertPoints(l[j]);
                        }
                        break;
                    }
                }

            }
        }
    }

    public loadRecordedDataIfNeeded(): void
    {   if (this.prop == null) return;
        if (!this.prop.Graph_showRecordedData) return;
        for (let i: number = 0; i < graphWidget.SeriesCount; i++)
        {   let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, "Graph_series" + i.toString()) as YoctoVisualization.ChartSerie;
            s.DataSource_source.startDataloggerload(this);
        }
    }

    public removeDataloggerData():void
    {  //todo :  remove data < (Ysensor) .get_firstLiveDataTimeStamp  from graph
    }
/*
    public DataLoggerProgress(): void
    {
        let progress: number = 0;
        let sensorCount: number = 0;

        if (!this.prop.Graph_showRecordedData)
        {
            this.dataloggerProgress.enabled=false;
            return;
        }

        let props: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(this.prop);
        for (let i: number = 0; i < props.byIndex.length; i++)
        {
            let name = props.byIndex[i].name;
            if (name.startsWith("Graph_series"))
            {
                let s: YoctoVisualization.ChartSerie = Reflect.get(this.prop, name);
                if (!(s.DataSource_source instanceof YoctoVisualization.NullYSensor))
                {
                    progress += s.DataSource_source.getGetaLoadProgress();
                    sensorCount++;
                }
            }
        }

        if ((progress < 100 * sensorCount) && (sensorCount > 0))
        {  this.dataloggerProgress.text  = graphWidget.DataLoggerLoadingMsg+" (" + (progress / sensorCount).toFixed(0) + "%)";

        }
        else
        {
            this.dataloggerProgress.enabled=false;
        }
    }
    */


    public DataloggerCompleted(Source: YoctoVisualization.CustomYSensor): void
    {
        if (!this.prop.Graph_showRecordedData) return;
        let props: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(this.prop);
        for (let i: number = 0; i < this.seriesProperties.length; i++)
        {  if (this.seriesProperties[i].DataSource_source == Source)
            if (!this.seriesProperties[i].dataloggerAlreadyLoaded)
             {   this._graph.DisableRedraw();
                 this.preLoadSensorData(Source, i);
                 this._graph.AllowRedraw();
             }

        }
    }

//#ifndef READONLY
    public getConfigData(): string
    {

        return "<GraphForm>\n" + this.getContentsConfigData() + "</GraphForm>\n";
    }
//#endif
}





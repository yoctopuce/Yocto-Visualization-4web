/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  log file window
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
export class logForm {
    static show() {
        if (logForm._window == null) {
            let params = new YoctoVisualization.newWindowParam();
            params.positionType = 0 /* YoctoVisualization.WindowPositionType.REGULAR */;
            params.width = (8 * window.innerWidth / 10) >> 0;
            params.height = (6 * window.innerHeight / 10) >> 0;
            params.left = (1 * window.innerWidth / 10) >> 0;
            params.top = (2 * window.innerHeight / 10) >> 0;
            params.title = "LogFile";
            logForm._window = new YoctoVisualization.YWindow(params);
            logForm._contents = logForm._window.innerContentDiv;
            logForm._contents.style.fontFamily = "courrier";
            logForm._contents.style.fontSize = (10 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            logForm._contents.style.overflow = "auto";
            for (let i = 0; i < logForm._lines.length; i++) {
                logForm.addLine(logForm._lines[i]);
            }
        }
        logForm._window.show();
    }
    static addLine(st) {
        let pre = document.createElement("PRE");
        pre.style.marginTop = "0";
        pre.style.marginBottom = "0";
        pre.innerText = st;
        logForm._contents.appendChild(pre);
        while (logForm._contents.childElementCount > 1000) {
            logForm._contents.removeChild(logForm._contents.firstChild);
        }
    }
    static padStart(st, length) {
        while (st.length < length) {
            st = '0' + st;
        }
        return st;
    }
    static dateToString(d) {
        return d.getFullYear().toString() + "-" + logForm.padStart((d.getMonth() + 1).toString(), 2) + "-" + logForm.padStart(d.getDate().toString(), 2) + " "
            + logForm.padStart(d.getHours().toString(), 2) + ":" + logForm.padStart(d.getMinutes().toString(), 2) + ":" + logForm.padStart((d.getSeconds() + d.getMilliseconds() / 1000).toFixed(3), 6);
    }
    static log(st) {
        logForm.logNOTS(logForm.dateToString(new Date()) + " " + st);
    }
    static logNOTS(st) {
        logForm._lines.push(st);
        if (logForm._lines.length > 1000) {
            logForm._lines.splice(0, logForm._lines.length - 1000);
        }
        if (logForm._window != null)
            logForm.addLine(st);
    }
}
logForm._lines = [];

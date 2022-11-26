/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Raw data visualization and export interface
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
export class rawDataForm {
    static hide() {
        if (rawDataForm._window == null)
            return;
        rawDataForm._window.visible = false;
    }
    static show() {
        if (rawDataForm._window == null) {
            let params = new YoctoVisualization.newWindowParam();
            params.positionType = 1 /* YoctoVisualization.WindowPositionType.CENTERED */;
            params.width = (9 * window.innerWidth / 10) >> 0;
            params.height = (8 * window.innerHeight / 10) >> 0;
            params.title = "Raw data";
            rawDataForm._window = new YoctoVisualization.YWindow(params);
            rawDataForm._contents = rawDataForm._window.innerContentDiv;
            rawDataForm._statusline = document.createElement("DIV");
            rawDataForm._statusline.style.position = "absolute";
            rawDataForm._statusline.style.left = YoctoVisualization.constants.WindowPadding.toString() + "px";
            rawDataForm._statusline.style.right = YoctoVisualization.constants.WindowPadding.toString() + "px";
            rawDataForm._statusline.style.height = (rawDataForm.STATUSLINEHEIGHT * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._statusline.style.bottom = (YoctoVisualization.constants.WindowPadding.toString()) + "px";
            rawDataForm._statusline.style.paddingTop = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._statusline.style.paddingLeft = "5px";
            rawDataForm._statusline.style.paddingRight = "5px";
            rawDataForm._statusline.style.overflowX = "auto";
            rawDataForm._statusline.style.paddingRight = "5px";
            rawDataForm._contents.append(rawDataForm._statusline);
            rawDataForm._sensorsList = document.createElement("DIV");
            rawDataForm._sensorsList.style.position = "absolute";
            rawDataForm._sensorsList.style.left = YoctoVisualization.constants.WindowPadding.toString() + "px";
            rawDataForm._sensorsList.style.right = (rawDataForm.sensorListWidth * YoctoVisualization.constants.generalSizeCoef + 8 * YoctoVisualization.constants.WindowPadding).toString() + "px";
            rawDataForm._sensorsList.style.top = "2px";
            rawDataForm._sensorsList.style.overflowY = "auto";
            rawDataForm._sensorsList.style.height = (rawDataForm.topMargin * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._sensorsList.style.paddingLeft = "5px";
            rawDataForm._sensorsList.style.paddingRight = "5px";
            rawDataForm._sensorsList.style.border = YoctoVisualization.constants.WindowInnerBorder;
            rawDataForm._sensorsList.style.backgroundColor = YoctoVisualization.constants.WindowInnerBackgroundColor;
            rawDataForm._contents.append(rawDataForm._sensorsList);
            rawDataForm._optionsList = document.createElement("DIV");
            rawDataForm._optionsList.style.position = "absolute";
            rawDataForm._optionsList.style.width = (rawDataForm.sensorListWidth * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._optionsList.style.right = YoctoVisualization.constants.WindowPadding.toString() + "px";
            rawDataForm._optionsList.style.top = "0px";
            rawDataForm._optionsList.style.height = (rawDataForm.topMargin * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._optionsList.style.paddingLeft = "5px";
            rawDataForm._optionsList.style.paddingRight = "5px";
            rawDataForm._optionsList.style.border = "1px solid transparent";
            rawDataForm._contents.append(rawDataForm._optionsList);
            let br;
            rawDataForm._optionMIN = document.createElement("INPUT");
            rawDataForm._optionMIN.type = "input";
            rawDataForm._optionMIN.checked = false;
            rawDataForm._optionMIN.style.display = "inline";
            rawDataForm._optionMIN.type = "checkbox";
            rawDataForm._optionMIN.style.transform = "scale(" + YoctoVisualization.constants.generalSizeCoef.toString() + ")";
            rawDataForm._optionMIN.style.marginRight = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._optionMIN.addEventListener("change", () => { rawDataForm.refresh(); });
            rawDataForm._optionsList.append(rawDataForm._optionMIN);
            let span;
            span = document.createElement("SPAN");
            span.innerText = "Include minimum values";
            rawDataForm._optionsList.append(span);
            br = document.createElement("BR");
            rawDataForm._optionsList.append(br);
            rawDataForm._optionAVG = document.createElement("INPUT");
            rawDataForm._optionAVG.type = "input";
            rawDataForm._optionAVG.checked = true;
            rawDataForm._optionAVG.style.display = "inline";
            rawDataForm._optionAVG.type = "checkbox";
            rawDataForm._optionAVG.style.transform = "scale(" + YoctoVisualization.constants.generalSizeCoef.toString() + ")";
            rawDataForm._optionAVG.style.marginRight = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._optionAVG.addEventListener("change", () => { rawDataForm.refresh(); });
            rawDataForm._optionsList.append(rawDataForm._optionAVG);
            span = document.createElement("SPAN");
            span.innerText = "Include average values";
            rawDataForm._optionsList.append(span);
            br = document.createElement("BR");
            rawDataForm._optionsList.append(br);
            rawDataForm._optionMAX = document.createElement("INPUT");
            rawDataForm._optionMAX.type = "input";
            rawDataForm._optionMAX.checked = false;
            rawDataForm._optionMAX.style.display = "inline";
            rawDataForm._optionMAX.type = "checkbox";
            rawDataForm._optionMAX.style.transform = "scale(" + YoctoVisualization.constants.generalSizeCoef.toString() + ")";
            rawDataForm._optionMAX.style.marginRight = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._optionMAX.addEventListener("change", () => { rawDataForm.refresh(); });
            rawDataForm._optionsList.append(rawDataForm._optionMAX);
            span = document.createElement("SPAN");
            span.innerText = "Include maximum values";
            rawDataForm._optionsList.append(span);
            rawDataForm._optionsList.append(document.createElement("BR"));
            rawDataForm._optionsList.append(document.createElement("BR"));
            let p = document.createElement("P");
            p.style.textAlign = "center";
            let refreshBtn = new YoctoVisualization.button("refresh", () => { rawDataForm.refresh(); });
            p.appendChild(refreshBtn.Element);
            let ExportBtn = new YoctoVisualization.button("export", () => { rawDataForm.export(); });
            p.appendChild(ExportBtn.Element);
            rawDataForm._optionsList.append(p);
            rawDataForm._datacontents = document.createElement("DIV");
            rawDataForm._datacontents.style.position = "absolute";
            rawDataForm._datacontents.style.left = YoctoVisualization.constants.WindowPadding.toString() + "px";
            rawDataForm._datacontents.style.right = YoctoVisualization.constants.WindowPadding.toString() + "px";
            rawDataForm._datacontents.style.top = (rawDataForm.topMargin * YoctoVisualization.constants.generalSizeCoef + 5 * YoctoVisualization.constants.WindowPadding).toString() + "px";
            rawDataForm._datacontents.style.bottom = (4 * YoctoVisualization.constants.WindowPadding + rawDataForm.STATUSLINEHEIGHT * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            rawDataForm._datacontents.style.paddingLeft = "5px";
            rawDataForm._datacontents.style.paddingRight = "5px";
            rawDataForm._datacontents.style.overflowX = "auto";
            rawDataForm._datacontents.style.paddingRight = "5px";
            rawDataForm._contents.append(rawDataForm._datacontents);
            rawDataForm._dataTable = document.createElement("TABLE");
            rawDataForm._dataTable.style.position = "absolute";
            rawDataForm._dataTable.style.overflow = "auto";
            rawDataForm._dataTable.style.left = "0px";
            rawDataForm._dataTable.style.width = "100%";
            rawDataForm._dataTable.style.top = "0px";
            rawDataForm._dataTable.style.bottom = "0px";
            rawDataForm._dataTable.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
            rawDataForm._dataTable.style.borderCollapse = "colapse";
            rawDataForm._dataTable.style.borderSpacing = "0px";
            rawDataForm._dataTable.style.fontFamily = "sans-serif";
            rawDataForm._datacontents.appendChild(rawDataForm._dataTable);
        }
        rawDataForm._window.show();
        rawDataForm.refresh();
    }
    static refresh() {
        let list = [];
        for (let i = 0; i < YoctoVisualization.sensorsManager.sensorList.length; i++) {
            if (!(YoctoVisualization.sensorsManager.sensorList[i] instanceof YoctoVisualization.NullYSensor)) {
                list.push(YoctoVisualization.sensorsManager.sensorList[i]);
            }
        }
        rawDataForm._selection = [];
        for (let i = 0; i < list.length; i++) {
            let spanNode;
            let spanText;
            let input;
            if (i >= rawDataForm._sensorsList.childNodes.length) {
                spanNode = document.createElement("SPAN");
                input = document.createElement("INPUT");
                input.type = "input";
                input.checked = false;
                input.style.display = "inline";
                input.type = "checkbox";
                input.style.transform = "scale(" + YoctoVisualization.constants.generalSizeCoef.toString() + ")";
                input.style.marginRight = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
                input.addEventListener("change", () => { rawDataForm.refresh(); });
                spanNode.appendChild(input);
                spanText = document.createElement("SPAN");
                spanNode.appendChild(spanText);
                rawDataForm._sensorsList.appendChild(spanNode);
                spanNode.appendChild(document.createElement("BR"));
            }
            else {
                spanNode = rawDataForm._sensorsList.childNodes[i];
                input = spanNode.childNodes[0];
                spanText = spanNode.childNodes[1];
            }
            if (input.checked)
                rawDataForm._selection.push(list[i]);
            input.id = list[i].get_hardwareId();
            spanText.innerText = list[i].get_friendlyName();
        }
        while (rawDataForm._sensorsList.childNodes.length > list.length) {
            rawDataForm._sensorsList.removeChild(rawDataForm._sensorsList.lastChild);
        }
        rawDataForm.RefreshContents(rawDataForm._selection);
    }
    static padStart(st, length) {
        while (st.length < length) {
            st = '0' + st;
        }
        return st;
    }
    static UnixTimeStampTostring(ts) {
        let d = new Date(Date.UTC(1970, 0, 1));
        d.setUTCSeconds(ts >> 0, 1000 * (ts % 1));
        return d.getFullYear().toString() + "-" + rawDataForm.padStart((d.getMonth() + 1).toString(), 2) + "-" + rawDataForm.padStart(d.getDate().toString(), 2) + " "
            + rawDataForm.padStart(d.getHours().toString(), 2) + ":" + rawDataForm.padStart(d.getMinutes().toString(), 2) + ":" + rawDataForm.padStart((d.getSeconds() + d.getMilliseconds() / 1000).toFixed(3), 6);
    }
    static RefreshContents(slist) {
        let TH = document.createElement("THEAD");
        let TB = document.createElement("TBODY");
        let HR1 = document.createElement("TR");
        let HR2 = document.createElement("TR");
        let indexes = [];
        for (let i = 0; i < slist.length; i++) {
            indexes.push(slist[i].curData.length - 1);
        }
        while (rawDataForm._dataTable.childNodes.length > 0) {
            rawDataForm._dataTable.removeChild(rawDataForm._dataTable.lastChild);
        }
        rawDataForm._dataTable.appendChild(TH);
        rawDataForm._dataTable.appendChild(TB);
        let sMin = false;
        let sMax = false;
        let sAvg = false;
        let toShow = 0;
        if (rawDataForm._optionMIN.checked) {
            sMin = true;
            toShow++;
        }
        if (rawDataForm._optionAVG.checked) {
            sAvg = true;
            toShow++;
        }
        if (rawDataForm._optionMAX.checked) {
            sMax = true;
            toShow++;
        }
        TH.appendChild(HR1);
        TH.appendChild(HR2);
        let cell = document.createElement("TH");
        HR1.appendChild(cell);
        cell = document.createElement("TH");
        HR2.appendChild(cell);
        for (let i = 0; i < slist.length; i++) {
            cell = document.createElement("TH");
            cell.innerText = slist[i].get_friendlyName();
            cell.colSpan = Math.max(1, toShow);
            cell.style.backgroundColor = "#f0f0f0";
            cell.style.borderLeft = YoctoVisualization.constants.WindowInnerBorder;
            cell.style.borderRight = YoctoVisualization.constants.WindowInnerBorder;
            cell.style.borderTop = YoctoVisualization.constants.WindowInnerBorder;
            HR1.appendChild(cell);
            if (sMin) {
                cell = document.createElement("TH");
                cell.innerText = "Min";
                cell.style.borderLeft = YoctoVisualization.constants.WindowInnerBorder;
                cell.style.borderRight = (sAvg || sMax) ? "" : YoctoVisualization.constants.WindowInnerBorder;
                cell.style.backgroundColor = "#f0f0f0";
                cell.style.textAlign = "right";
                HR2.appendChild(cell);
            }
            if (sAvg) {
                cell = document.createElement("TH");
                cell.innerText = "Avg";
                cell.style.borderLeft = (sMin) ? "" : YoctoVisualization.constants.WindowInnerBorder;
                cell.style.borderRight = (sMax) ? "" : YoctoVisualization.constants.WindowInnerBorder;
                cell.style.backgroundColor = "#f0f0f0";
                cell.style.textAlign = "right";
                HR2.appendChild(cell);
            }
            if (sMax) {
                cell = document.createElement("TH");
                cell.innerText = "Max";
                cell.style.borderLeft = (sAvg || sMin) ? "" : YoctoVisualization.constants.WindowInnerBorder;
                cell.style.borderRight = YoctoVisualization.constants.WindowInnerBorder;
                cell.style.backgroundColor = "#f0f0f0";
                cell.style.textAlign = "right";
                HR2.appendChild(cell);
            }
        }
        let colcount = slist.length * toShow;
        let MaxTimeStamp = 0;
        for (let i = 0; i < slist.length; i++) {
            if (indexes[i] >= 0) {
                if (MaxTimeStamp < slist[i].curData[indexes[i]].DateTime) {
                    MaxTimeStamp = slist[i].curData[indexes[i]].DateTime;
                }
            }
        }
        let rowcount = 0;
        let currentRow = null;
        while ((MaxTimeStamp > 0) && (rowcount < rawDataForm.MAXRAWDATAROWS)) {
            let row = new Array(colcount);
            let nextTimeStamp = 0;
            for (let i = 0; i < slist.length; i++) {
                let Shown = false;
                if (indexes[i] >= 0) {
                    if (slist[i].curData[indexes[i]].DateTime == MaxTimeStamp) {
                        let n = 0;
                        if (sMin) {
                            row[n + i * toShow] = slist[i].minData[indexes[i]].value.toString();
                            n++;
                        }
                        if (sAvg) {
                            row[n + i * toShow] = slist[i].curData[indexes[i]].value.toString();
                            n++;
                        }
                        if (sMax) {
                            row[n + i * toShow] = slist[i].maxData[indexes[i]].value.toString();
                            n++;
                        }
                        Shown = true;
                        indexes[i]--;
                    }
                    if (indexes[i] >= 0) {
                        if (slist[i].curData[indexes[i]].DateTime > nextTimeStamp) {
                            nextTimeStamp = slist[i].curData[indexes[i]].DateTime;
                        }
                    }
                }
                if (!Shown) {
                    let n = 0;
                    if (sMin) {
                        row[n + i * toShow] = "";
                        n++;
                    }
                    if (sAvg) {
                        row[n + i * toShow] = "";
                        n++;
                    }
                    if (sMax) {
                        row[n + i * toShow] = "";
                        n++;
                    }
                }
            }
            if ((colcount > 0) && (toShow > 0)) {
                currentRow = document.createElement("TR");
                let cell = document.createElement("TD");
                cell.innerText = rawDataForm.UnixTimeStampTostring(MaxTimeStamp).toLocaleString();
                cell.style.borderLeft = YoctoVisualization.constants.WindowInnerBorder;
                cell.style.borderTop = (rowcount == 0) ? YoctoVisualization.constants.WindowInnerBorder : "";
                cell.style.backgroundColor = "#f0f0f0";
                currentRow.style.backgroundColor = ((rowcount & 1) == 0) ? "white" : "#f0f0f0";
                currentRow.appendChild(cell);
                for (let j = 0; j < row.length; j++) {
                    cell = document.createElement("TD");
                    cell.innerText = row[j];
                    cell.style.textAlign = "right";
                    cell.style.borderLeft = (j % toShow) == 0 ? YoctoVisualization.constants.WindowInnerBorder : "";
                    cell.style.borderRight = ((j + 1) % toShow) == 0 ? YoctoVisualization.constants.WindowInnerBorder : "";
                    cell.style.fontFamily = "monospace";
                    currentRow.appendChild(cell);
                }
                TB.appendChild(currentRow);
                rowcount++;
            }
            MaxTimeStamp = nextTimeStamp;
        }
        if (currentRow != null) {
            for (let i = 0; i < currentRow.childNodes.length; i++) {
                currentRow.childNodes[i].style.borderBottom = YoctoVisualization.constants.WindowInnerBorder;
            }
        }
        if (toShow == 0) {
            rawDataForm._statusline.style.backgroundColor = "#FF8080";
            rawDataForm._statusline.innerText = "No data shown, select at least Min, Avg or Max options in the top-right checkboxes";
        }
        else if ((rowcount) == 0) {
            rawDataForm._statusline.style.backgroundColor = "#FF8080";
            rawDataForm._statusline.innerText = "No data shown, select at least one sensor in the list above.";
        }
        else {
            rawDataForm._statusline.style.backgroundColor = YoctoVisualization.constants.WindowBackgroundColor;
            if (rowcount < rawDataForm.MAXRAWDATAROWS) {
                rawDataForm._statusline.innerText = "These are the last " + rowcount.toString() + " data rows.";
            }
            else {
                rawDataForm._statusline.innerText = "These are the last " + rowcount.toString() + " data rows.  Use the export feature to get the whole data set.";
            }
        }
        //CsvBtn.Enabled = ((rowcount > 0) && (toShow > 0));
    }
    static getCvsdata(slist, sMin, sAvg, sMax) {
        let toShow = 0;
        let indexes = [];
        for (let i = 0; i < slist.length; i++) {
            indexes.push(0);
        }
        if (sMin)
            toShow++;
        if (sAvg)
            toShow++;
        if (sMax)
            toShow++;
        let res;
        let ColumnHeader = "Timestamp";
        for (let i = 0; i < slist.length; i++) {
            let sName = slist[i].toString();
            if (sMin)
                ColumnHeader += ";" + sName + "(min)";
            if (sAvg)
                ColumnHeader += ";" + sName + "(avg)";
            if (sMax)
                ColumnHeader += ";" + sName + "(max)";
        }
        res = ColumnHeader + "\r\n";
        let colcount = slist.length * toShow;
        let MinTimeStamp = Number.POSITIVE_INFINITY;
        for (let i = 0; i < slist.length; i++) {
            if (indexes[i] < slist[i].curData.length) {
                if (MinTimeStamp > slist[i].curData[indexes[i]].DateTime) {
                    MinTimeStamp = slist[i].curData[indexes[i]].DateTime;
                }
            }
        }
        while ((MinTimeStamp < Number.POSITIVE_INFINITY)) {
            let line = "";
            let nextTimeStamp = Number.POSITIVE_INFINITY;
            for (let i = 0; i < slist.length; i++) {
                let Shown = false;
                if (indexes[i] < slist[i].curData.length) {
                    if (slist[i].curData[indexes[i]].DateTime == MinTimeStamp) {
                        if (sMin)
                            line += ";" + slist[i].minData[indexes[i]].value.toString();
                        if (sAvg)
                            line += ";" + slist[i].curData[indexes[i]].value.toString();
                        if (sMax)
                            line += ";" + slist[i].maxData[indexes[i]].value.toString();
                        Shown = true;
                        indexes[i]++;
                    }
                    if (indexes[i] < slist[i].curData.length) {
                        if (slist[i].curData[indexes[i]].DateTime < nextTimeStamp) {
                            nextTimeStamp = slist[i].curData[indexes[i]].DateTime;
                        }
                    }
                }
                if (!Shown) {
                    if (sMin)
                        line += " ; ";
                    if (sAvg)
                        line += " ; ";
                    if (sMax)
                        line += " ; ";
                }
            }
            if (colcount > 0)
                line = rawDataForm.UnixTimeStampTostring(MinTimeStamp) + line;
            res += line + "\r\n";
            MinTimeStamp = nextTimeStamp;
        }
        return res;
    }
    static export() {
        let element = document.createElement('a');
        let data = 'data:text/csv;charset=utf-8,' + encodeURI(rawDataForm.getCvsdata(rawDataForm._selection, rawDataForm._optionMIN.checked, rawDataForm._optionAVG.checked, rawDataForm._optionMAX.checked));
        element.setAttribute('href', data);
        element.setAttribute('download', "rawdata.csv");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
rawDataForm._lines = [];
rawDataForm.topMargin = 100;
rawDataForm.sensorListWidth = 200;
rawDataForm.MAXRAWDATAROWS = 100;
rawDataForm.STATUSLINEHEIGHT = 20;
rawDataForm._selection = [];

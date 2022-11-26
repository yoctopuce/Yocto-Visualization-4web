/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Hub credential prompt
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

import * as YoctoVisualization from "./YoctoVisualizationFull.js";
import {AlarmSection} from "./YoctoVisualizationFull.js";

export interface CredentialsPromptDone {(username:string | null,password:string|null): void;}

export class CredentialsPrompt
{


    private static _window: YoctoVisualization.YWindow
    private static _contents: HTMLDivElement

    private static _okButton: YoctoVisualization.button;
    private static _cancelButton: YoctoVisualization.button;



    private static _usernameInput: HTMLInputElement;
    private static _passwordInput: HTMLInputElement;


    private static _whenDone: CredentialsPromptDone | null = null;

    private static fontSize: number = YoctoVisualization.constants.generalFontSize;
    public static get activeBorderColor(): string { return YoctoVisualization.constants.WindowInnerBorderColor;}
    public static get inactiveBorderColor(): string { return "#b0b0b0";}
    public static get activeColor(): string { return "black";}
    public static get inactiveColor(): string { return "grey";}
    public static get activeBackgroundColor(): string { return YoctoVisualization.constants.WindowInnerBackgroundColor;}
    public static get inactiveBackgroundColor(): string { return YoctoVisualization.constants.WindowBackgroundColor;}

    private static _username :string="";
    private static _password :string="";

    public static get username(): string { return this._username; }
    public static get password(): string { return this._password; }



public static show( targeturl : string, whenDone: CredentialsPromptDone | null)
    {


        if (CredentialsPrompt._window == null)
        {
            CredentialsPrompt._okButton = new YoctoVisualization.button("Ok", () => {CredentialsPrompt.okClicked()});
            CredentialsPrompt._cancelButton = new YoctoVisualization.button("Cancel", () => { CredentialsPrompt.hide()});
            let params: YoctoVisualization.newWindowParam
              = new YoctoVisualization.newWindowParam();
            params.positionType = YoctoVisualization.WindowPositionType.CENTERED
            params.width = Math.round(450 * YoctoVisualization.constants.generalSizeCoef);
            params.height = Math.round(175 * YoctoVisualization.constants.generalSizeCoef);
            params.isModal = true;
            params.closeIcon = false;
            params.title = "Some credentials are required";
            params.buttons.push(CredentialsPrompt._okButton);
            params.buttons.push(CredentialsPrompt._cancelButton);

            CredentialsPrompt._window = new YoctoVisualization.YWindow(params)

            CredentialsPrompt._contents = CredentialsPrompt._window.innerContentDiv;

            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
            p.style.paddingTop = "10px";
            p.style.marginTop = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";

            p.style.lineHeight = Math.round(15 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            p.innerText = "Saving configuration on "+targeturl+" requires  read/write credentials.";
            p.style.textAlign = "justify"
            CredentialsPrompt._contents.appendChild(p);

            p.appendChild(document.createElement("BR"))
            p.appendChild(document.createElement("BR"))

            let span: HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;


            span = document.createElement("SPAN") as HTMLSpanElement;
            span.innerText = "Username:";
            span.style.marginLeft = Math.round(20 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            p.appendChild(span)
            CredentialsPrompt._usernameInput = document.createElement("INPUT") as HTMLInputElement;
            CredentialsPrompt._usernameInput.style.border = "1px solid grey";
            CredentialsPrompt._usernameInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
            CredentialsPrompt._usernameInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
            CredentialsPrompt._usernameInput.size = 15;
            p.appendChild(CredentialsPrompt._usernameInput);

            span = document.createElement("SPAN") as HTMLSpanElement;
            span.innerText = "Password:";
            span.style.marginLeft = Math.round(20 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            p.appendChild(span)
            CredentialsPrompt._passwordInput = document.createElement("INPUT") as HTMLInputElement;
            CredentialsPrompt._passwordInput.type = "password"
            CredentialsPrompt._passwordInput.style.border = "1px solid grey";
            CredentialsPrompt._passwordInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
            CredentialsPrompt._passwordInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
            CredentialsPrompt._passwordInput.size = 15;
            CredentialsPrompt._passwordInput.addEventListener('keypress', (e:KeyboardEvent) => {if  (e.key=='Enter') this.okClicked()});



            p.appendChild(CredentialsPrompt._passwordInput);
        }

        CredentialsPrompt._window.show();
    CredentialsPrompt._usernameInput.focus();
        CredentialsPrompt._whenDone = whenDone;
    }

    static hide(): void
    {
        if (CredentialsPrompt._window == null) return;
        CredentialsPrompt._window.hide();
        CredentialsPrompt._passwordInput.value = "";

    }

    static okClicked(): void
    {    CredentialsPrompt._username = CredentialsPrompt._usernameInput.value;
         CredentialsPrompt._password = CredentialsPrompt._passwordInput.value;
         CredentialsPrompt.hide();
        if (CredentialsPrompt._whenDone != null) CredentialsPrompt._whenDone(CredentialsPrompt._usernameInput.value,CredentialsPrompt._passwordInput.value);
    }

}

//#endif

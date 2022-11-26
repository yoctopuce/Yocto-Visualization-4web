/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  All SVG based icons are defined here
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

export class ressources
{
    private static SVGheader(size: string, shadowDef: boolean, title?: string): string
    {
        let res: string = '<svg  xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 128  128">';
        if (typeof (title) != "undefined") res = res + "<title>" + title + "</title>";
        if (shadowDef) res = res + '<defs><filter id="f1" x="0" y="0"><feGaussianBlur in="SourceGraphic" stdDeviation="2" /></filter></defs>';
        res = res + '<g transform="translate(0,128)">'
            + '<g transform="scale(1,-1)">';
        return res;
    }

    private static SVGFooter(): string
    {
        return '</g></g></svg>';
    }

    private static addIconTransparency(): string { return '<g opacity="0.5">' };

    private static addIconSrcCode(): string
    {
        return '<path d="m 8 24 L 8 40 L 24 40 L 24 56 L 40 56 L 40 40 L 56 40 L 56 24 L 40 24 L 40 8 L 24 8 L 24 24   Z" fill="#40ff40" stroke="black" stroke-width="8" stroke-linecap="round"/>'
    }

    private static deleteIconSrcCode(): string
    {
        return '<path d="m 15 4 L 4 15 L 19 29 L 4 43 L 15 55 L 29 40 L 43 55 L 55 43 L 40 29 L 55 15 L 44 4 L 29 18 Z" fill="#ff4040" stroke="black" stroke-width="8" stroke-linecap="round">';
    }

    private static IconSourceCode(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, shadowcode: string, activeCode: string, title?: string): string
    {
        let res: string = ressources.SVGheader(size, shadow, title);
        if (shadow) res = res + '<g transform="translate(6,-6)">' + shadowcode + "</g>"
        if (semitransparent) res = res + ressources.addIconTransparency();
        res = res + activeCode;
        if (semitransparent) res = res + '</g>';
        if (addIcon) res = res + ressources.addIconSrcCode();
        if (deleteIcon) res = res + ressources.deleteIconSrcCode();
        res = res + ressources.SVGFooter();
        return res;
    }

    public static GraphIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 12 24 L 103 24 L 103 107 L 12 107 z" fill="lightgray" filter="url(#f1)" />'
            + '<path d="m 112 24 L 12 24 L 12 113"  style="fill:none; stroke:lightgray; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;" filter="url(#f1)"/>'
            ,
            '<path d="m 12 24 L 103 24 L 103 107 L 12 107 z" fill="#ffffe9" />'
            + '<line x1="43" y1="24" x2="43" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<line x1="43" y1="24" x2="43" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<line x1="73" y1="24" x2="73" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<line x1="12" y1="51" x2="103" y2="51" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<line x1="12" y1="79" x2="103" y2="79" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<line x1="12" y1="107" x2="103" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<path d="m 12 77 L 34 65 L 55 85 L 70 77 L 100 93" fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />'
            + '<line x1="103" y1="24" x2="103" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" />'
            + '<path d="m 112 24 L 12 24 L 12 113"  style="fill:none; stroke:black; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;"/>'
        );
    }

    public static SolidGaugeIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 114 52 L  114 40 L 94 40 L 94 52 A 30 30 0 1 1  34 52 Z" style="fill:lightgray;fill-opacity=0.4;" filter="url(#f1)"/>'
            + '<text x="43" y="-30" fill="black" transform="scale(1,-1)" style="font: bold 24px sans-serif;fill:lightgray;fill-opacity=0.4;" filter="url(#f1)">123</text>'
            ,
            '<path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 114 52 L  114 40 L 94 40 L 94 52 A 30 30 0 1 1  34 52 Z" style="fill:#ffffe9; stroke:none; "/>'
            + '<path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 29 88 L  43 72.5   A 30 30 0 0 1  34 52 Z" style="fill:red; stroke:none;"/>'
            + '<path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 114 52 L  114 40 L 94 40 L 94 52 A 30 30 0 1 1  34 52 Z" style="fill:none; stroke:black; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;"/>'
            + '<text x="43" y="-30" fill="black" transform="scale(1,-1)" style="font: bold 24px sans-serif;">123</text>'
        );
    }

    public static RawDataIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 16 27 L 107 27 L 107 107 L 16 107 z" fill="lightgray" filter="url(#f1)" />',
            '<path d="m 16 27 L 107 27 L 107 107 L 16 107 z" style="fill:#ffffe9;" />'
            + '<line x1="47" y1="27" x2="47" y2="107" stroke="#e3e3e3" stroke-width="2"  />'
            + '<line x1="76" y1="27" x2="76" y2="107" stroke="#e3e3e3" stroke-width="2"  />'
            + '<line x1="16" y1="44" x2="107" y2="44" stroke="#e3e3e3" stroke-width="2"  />'
            + '<line x1="16" y1="60" x2="107" y2="60" stroke="#e3e3e3" stroke-width="2"  />'
            + '<line x1="16" y1="76" x2="107" y2="76" stroke="#e3e3e3" stroke-width="2"  />'
            + '<path d="m 16 27 L 107 27 L 107 107 L 16 107 z" style="fill:none;stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m 19 91 L 104 91 L 104 104 L 19 104 z" style="fill:#b2b2b2; stroke:#6f6f6f; stroke-width:4px; stroke-linejoin:round;" />'
            + '<line x1="47" y1="91" x2="47" y2="104" stroke="#6f6f6f" stroke-width="2"  />'
            + '<line x1="76" y1="91" x2="76" y2="104" stroke="#6f6f6f" stroke-width="2"  />');
    }

    public static ConfigureIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="M85 85 L 102 80 L 113 91 A  41 100 45 0 0  86 71 L 37 21 A  5 11 45 1 0  21 37 L 71 86  A  41 100 45 0 0  91 113 L 80 102 Z" style="fill:lightgray;fill-opacity=0.4;" filter="url(#f1)"/>'
            ,
            '<path d="M85 85 L 102 80 L 113 91 A  41 100 45 0 0  86 71 L 37 21 A  5 11 45 1 0  21 37 L 71 86  A  41 100 45 0 0  91 113 L 80 102 Z" style="fill:grey; stroke:black; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;"/>'
        );
    }

    public static DigitalDisplayIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 12 45 L 111 45 L 111 89 L 12 89 z" fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 12 45 L 111 45 L 111 89 L 12 89 z" style="fill:#ffffe9; stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '<text x="29" y="-52" fill="black" transform="scale(1,-1)" style="font: bold 40px sans-serif;">123</text> '
        );

    }

    public static AngularGaugeIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<circle  cx="64" cy="64" r="40" fill="lightgray" filter="url(#f1)" />'
            ,
            '<circle  cx="64" cy="64" r="40" stroke="black" stroke-width="4" fill="#ffffe9" />'
            + '<line x1="64" y1="104" x2="64" y2="94" stroke="black" stroke-width="2"   stroke-linecap="round" />'
            + '<line x1="29" y1="84" x2="38" y2="79" stroke="black" stroke-width="2"   stroke-linecap="round" />'
            + '<line x1="29" y1="44" x2="38" y2="48" stroke="black" stroke-width="2"   stroke-linecap="round" />'
            + '<line x1="98" y1="84" x2="91" y2="79" stroke="black" stroke-width="2"   stroke-linecap="round" />'
            + '<line x1="98" y1="44" x2="91" y2="48" stroke="black" stroke-width="2"   stroke-linecap="round" />'
            + '<g transform="translate(64,64)">'
            + '<g transform="rotate(-70,0,0)">'
            + '<path d="m 5 0 L 0 5 L -25 0 L 0 -5 z" style="fill:black;stroke:black; stroke-width:2px; stroke-linejoin:round;"/>'
            + '</g></g>'
        );

    }

    public static EditIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 16 48 L 108 48 L 108 88 L 16 88 z" fill="lightgray" filter="url(#f1)" />'
            + '<path d="m 87 24 L 75 40 L 67 31 L 62 64 L 93 50 L 82 44  L 94 29 z" fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 16 48 L 108 48 L 108 88 L 16 88 z" style="fill:#ffffe9; stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m 87 24 L 75 40 L 67 31 L 62 64 L 93 50 L 82 44  L 94 29 z" style="fill:white; stroke:black; stroke-width:2px; stroke-linejoin:round;" /> '
        );
    }

    public static AllIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 60 108 L 46 74 L 8 72 L 38 48 L 28 12 L 60 32 L 92 12  L 82 48 L 112 70  L 74 74  z" fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 60 108 L 46 74 L 8 72 L 38 48 L 28 12 L 60 32 L 92 12  L 82 48 L 112 70  L 74 74  z" style="fill:#fee403; stroke:#918201; stroke-width:4px; stroke-linejoin:round;" />'
        );
    }

    public static TrashIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 33 12 L 24 94 L 104 94 L 95 12 z" fill="lightgray" filter="url(#f1)" />'
            + '<g transform="translate(70,105)">'
            + '<g transform="rotate(-10,0,0)">'
            + '<path d="m -40 0 L -30 5 L 30 5 L 40 0 z" fill="lightgray" filter="url(#f1)" />'
            + '<path d="m -9 5 L -9 12 L 9 12 L 9 5" stroke="lightgray" filter="url(#f1)"/>'
            + ' </g></g>'
            ,
            '<path d="m 33 12 L 24 94 L 104 94 L 95 12 z" style="fill:#f8f8f8; stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '<Line x1="43" y1="82" x2="48" y2="21" style=" stroke:black; stroke-width:4px; stroke-linecap:round;" />'
            + '<Line x1="64" y1="82" x2="64" y2="21" style=" stroke:black; stroke-width:4px; stroke-linecap:round;" />'
            + '<Line x1="86" y1="82" x2="80" y2="21" style=" stroke:black; stroke-width:4px; stroke-linecap:round;" />'
            + '<g transform="translate(70,105)">'
            + '<g transform="rotate(-10,0,0)">'
            + '<path d="m -40 0 L -30 5 L 30 5 L 40 0 z" style="fill:#f8f8f8; stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m -9 5 L -9 12 L 9 12 L 9 5" style="fill:none; stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '</g></g>'
        );
    }

    public static SaveIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 20 12 A 4 4 0 0 0 16 16 L 16 106  A 4 4 0 0 0 20 110 L 24 110 L 24 108 L 97 108 L 97 110 L 104 110  A 4 4 0 0 0 108 106 L 108 16   A 4 4 0 0 0 104 12  z" fill="lightgray" filter="url(#f1)" />'

            ,
            '<path d="m 20 12 A 4 4 0 0 0 16 16 L 16 106  A 4 4 0 0 0 20 110 L 24 110 L 24 108 L 97 108 L 97 110 L 104 110  A 4 4 0 0 0 108 106 L 108 16   A 4 4 0 0 0 104 12  z" style="fill:#3583dd; stroke:#226fc8; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m 24 11 L 24 65  A 5 5 0 0 0 29 70 L 95 70  A 5 5 0 0 0 100 65 L 100 11  z" style="fill:#f7f7f7; stroke:#c6c6c6; stroke-width:2px; stroke-linejoin:round;"/>'
            + '<path d="m 36 111 L 90 111 L 90 80 A 4 4 0 0 0 86 76 L 40 76 A 4 4 0 0 0 36 80 z"  style="fill:#e5e5e5; stroke:#c6c6c6; stroke-width:2px; stroke-linejoin:round;" />'
            + '<rect x="67" y="79" width="14" height ="28"     style="fill:#3583dd; stroke:#c6c6c6; stroke-width:2px; stroke-linejoin:round;"'
        );
    }

    public static SaveNeededIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 8 16 L 64 110 L 120 16 z " style="fill:lightgray; stroke:lightgray; stroke-width:10px; stroke-linejoin:round;filter:url(#f1)" />'

            ,
            '<path d="m 8 16 L 64 110 L 120 16 z" style="fill:#FAE701; stroke:#FAE701; stroke-width:10px; stroke-linejoin:round;" />'
            + '<path d="m 8 16 L 64 110 L 120 16 z" style="fill:none; stroke:black; stroke-width:2px; stroke-linejoin:round;" />'
            + '<g transform="translate(-64,-64) scale(0.4 0.4) translate(260,215)">'
            + '<path d="m 20 12 A 4 4 0 0 0 16 16 L 16 106  A 4 4 0 0 0 20 110 L 24 110 L 24 108 L 97 108 L 97 110 L 104 110  A 4 4 0 0 0 108 106 L 108 16   A 4 4 0 0 0 104 12  z" style="fill:black; stroke:black; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m 24 11 L 24 65  A 5 5 0 0 0 29 70 L 95 70  A 5 5 0 0 0 100 65 L 100 11  z" style="fill:#FAE701; stroke:black; stroke-width:2px; stroke-linejoin:round;"/>'
            + '<path d="m 36 111 L 90 111 L 90 80 A 4 4 0 0 0 86 76 L 40 76 A 4 4 0 0 0 36 80 z"  style="fill:#FAE701; stroke:black; stroke-width:2px; stroke-linejoin:round;" />'
            + '<rect x="67" y="79" width="14" height ="28"     style="fill:#FAE701; stroke:black; stroke-width:2px; stroke-linejoin:round;"'
            + '</g>'
            , "Don't forget to save."
        );
    }

    public static snapshotIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 16 32  L 16 78 A 6 6 0 0 0 22 84 L 46 84 L 48 94 A 5.75 3.25 30 0 0 54 100 L 78 100 A 3.25 5.75  30 0 0 84 94  L 86 84 L 104 84  A 6 6 0 0 0 110 78  L 110 32 A 6 6 0 0 0 104 26 L 22 26 A 6 6 0 0 0 16 32 z"  fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 16 32  L 16 78 A 6 6 0 0 0 22 84 L 46 84 L 48 94 A 5.75 3.25 30 0 0 54 100 L 78 100 A 3.25 5.75  30 0 0 84 94  L 86 84 L 104 84  A 6 6 0 0 0 110 78  L 110 32 A 6 6 0 0 0 104 26 L 22 26 A 6 6 0 0 0 16 32 z" style="fill:#707070; stroke:#464646; stroke-width:4px; stroke-linejoin:round;" />'
            + '<Circle cx="65" cy="55" r="26"   style="fill:#895e96; stroke:#464646; stroke-width:6px; stroke-linejoin:round;" />'
        );
    }

    public static CloseIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 21.6 38.6 L 47.1 64.3 L 22 89.5 L 38.4 106.2 L 64 81 L 89.3 106.2 L 105.8 89.5 L 80.6 64 L 105.8 38.9 L 89.3 22.2 L 64 47.5  L 38.3 22.1 z"  fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 21.6 38.6 L 47.1 64.3 L 22 89.5 L 38.4 106.2 L 64 81 L 89.3 106.2 L 105.8 89.5 L 80.6 64 L 105.8 38.9 L 89.3 22.2 L 64 47.5  L 38.3 22.1 z" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            , title
        );
    }

    public static MoveToRightIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<rect x="12" y="52" width="4"  height="24" fill="lightgray" filter="url(#f1)" />'
            + '<rect x="20" y="52" width="8"  height="24" fill="lightgray" filter="url(#f1)" />'
            + '<rect x="56" y="16" width="16"  height="96" fill="lightgray" filter="url(#f1)" />'
            + '<path d="m  32 52 L 32 76 L 56 76 L 56 96 L 88 64 L 56 32 L 56 52 z" fill="lightgray" filter="url(#f1)" />'
            ,
            '<rect x="12" y="52" width="4"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            + '<rect x="20" y="52" width="8"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            + '<rect x="96" y="16" width="16"  height="96" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m  32 52 L 32 76 L 56 76 L 56 96 L 88 64 L 56 32 L 56 52 z" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            , title
        );
    }

    public static MoveToLeftIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<rect x="112" y="52" width="4"  height="24" fill="lightgray" filter="url(#f1)" />'
            + '<rect x="100" y="52" width="8"  height="24" fill="lightgray" filter="url(#f1)" />'
            + '<rect x="16" y="16" width="16"  height="96" fill="lightgray" filter="url(#f1)" />'
            + '<path d="m  96 52 L 96 76 L 72 76 L 72 96 L 40 64 L 72 32 L 72 52 z" fill="lightgray" filter="url(#f1)" />'

            ,
            '<rect x="112" y="52" width="4"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            + '<rect x="100" y="52" width="8"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            + '<rect x="16" y="16" width="16"  height="96" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            + '<path d="m  96 52 L 96 76 L 72 76 L 72 96 L 40 64 L 72 32 L 72 52 z" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />'
            , title
        );
    }

    public static ExpandIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m  24 56 L 24 72 L 56 72 L 56 104 L 72 104 L 72 72 L 104 72 L 104 56 L 72 56 L 72 24 L 56 24 L 56 56 z"  fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 24 56 L 24 72 L 56 72 L 56 104 L 72 104 L 72 72 L 104 72 L 104 56 L 72 56 L 72 24 L 56 24 L 56 56  z" style="fill:black; " />'
            , title
        );
    }

    public static OkIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />'
            ,
            '<circle cx="64" cy="64" r="56" fill="#00b20f"/>'
            + '<path d="m 19 72 L 34 87 L 60 62 L 94 96 L 109 81 L 60 32  z" style="fill:white; " />'
            , title
        );
    }

    public static FailedIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />'
            ,
            '<circle cx="64" cy="64" r="56" fill="#ff101e"/>'
            + '<path d="m 43 99 L 64 79 L 85 99 L 100 85 L 79 64 L 100 43 L 85 28 L 64 49 L 43 28 L 28  43 L 49 64 L  28 85   z" style="fill:white; " />'
            , title
        );
    }

    public static DontKnowIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />'
            ,
            '<circle cx="64" cy="64" r="56" fill="#f1ba00"/>'
            + '<text x="35" y="-30" fill="white" transform="scale(1,-1)" style="font: bold 96px sans-serif;">?</text> ', title
        );
    }

    public static infoIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
          '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />'
          ,
          '<circle cx="64" cy="64" r="56" fill="DodgerBlue"/>'
          + '<text x="50" y="-30" fill="white" transform="scale(1,-1)" style="font: bold 96px sans-serif;">i</text> ', title
        );
    }


    public static ColapseIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '<path d="m 24 56 L 24 72 L 104 72 L 104 56 z"  fill="lightgray" filter="url(#f1)" />'
            ,
            '<path d="m 24 56 L 24 72 L 104 72 L 104 56 z" style="fill:black; " />'
            , title
        );
    }

    public static AddMarkerIcon(size: string, index: number): string
    {
        return ressources.IconSourceCode(size, false, false, false, false,
            ''
            ,
            '<circle  cx="64" cy="64"  r="50"   style="fill:lightyellow;" stroke-width="8" stroke="darkred" />'

            + '<text x="46" y="-40" fill="black" transform="scale(1,-1)" style="font: bold 64px sans-serif;">' + index.toString() + '</text>'
        );
    }

    public static AddMarker(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '',
            '<line x1="80" y1="8" x2="80" y2="128" stroke="darkred" stroke-width="8" stroke-linecap="round" />'
            + '<path d="m 60 64 L 100 64 L 80 20 z" style="fill:darkred; " />'
            + '<rect x="40" y="56" width="80" height="32" style="fill:lightYellow" stroke="darkred" stroke-width="8" />'
        );
    }

    public static EraseDatalogger(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '',

            '<g transform="rotate(-35,0,0)">'
            + '<g transform="translate(-56,24)">'
            + '<path d="m 108 24 L 108 46 L 60 46  A 22 22 0 1 0 60 90 L 108 90  L 108 112 L 60 112 A 44 44 0 1 1 60 24 z" style="fill:#808080; " />'
            + '<rect x="88" y="24" width="20" height="22" style="fill:red" stroke="none"  />'
            + '<rect x="88" y="90" width="20" height="22" style="fill:blue" stroke="none"  />'
            + '<path d="m 108 24 L 108 46 L 60 46  A 22 22 0 1 0 60 90 L 108 90  L 108 112 L 60 112 A 44 44 0 1 1 60 24 z"  style="fill:none" stroke="black"  stroke-width="4" stroke-linejoin="round"/>'
            + "</g></g>"
        );
    }

    public static resetViewPort(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '',

            '<line x1="116" y1="52" x2="116" y2="12"  stroke="black"  stroke-width="4"/>'
            + '<line x1="12" y1="52" x2="12" y2="12"  stroke="black"  stroke-width="4"/>'
            + '<path d="m 100 36 L 28 36 L 28 48 L 12 32  L 28 16 L 28 28 L 100 28 L 100 16 L 116 32 L 100 48z" style="fill:white" stroke="black"  stroke-width="4" stroke-linejoin="round" />'
            + '<path d="m 7.3 97.7 L 20 107.4 L 51.6 114.7 L 78.5 112.2 L 101.6 103.3 L 114.4 91.7  L 117.7 81.7 L 104.3 66.9 L 80.9 61.2 L49.9 65 L 25 76.3 L 12.6 87.5 Z " style="fill:white" stroke="none" />'
            + '<circle  cx="64" cy="88" r="27" style="fill:#6cc87b" stroke="none"  /> '
            + '<path d="m 37.2 84.8 A 27 27 0 0 0 46.5 108.8 L 64 88 z" style="fill:#8ed698" stroke="none" /> '
            + '<circle  cx="64" cy="88" r="16" style="fill:black" stroke="none"  /> '
            + '<path d="m 6 97 A 59 34 -4 0 0 119 80" style="fill:none" stroke="black"  stroke-width="4"  stroke-linecap="round"/> '
            + '<path d="m 113 79 A 56 31 -16 0 0 9 93 " style="fill:none" stroke="black"  stroke-width="4"  stroke-linecap="round" /> '
        );
    }

    public static DeleteMarker(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '',
            '<line x1="80" y1="8" x2="80" y2="128" stroke="darkred" stroke-width="8" stroke-linecap="round" />'
            + '<path d="m 60 64 L 100 64 L 80 20 z" style="fill:darkred; " />'
            + '<rect x="40" y="56" width="80" height="32" style="fill:lightYellow" stroke="darkred" stroke-width="8" />'
        );
    }

    public static targetIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            ''
            ,
            '<circle  cx="64" cy="64"  r="42"   style="fill:none;" stroke-width="8" stroke="black" />'
            + '<line  x1="0"   y1="64"  x2="42"  y2="64"  style="fill:none;" stroke-width="8" stroke="black" />'
            + '<line  x1="128" y1="64"  x2="86"  y2="64"  style="fill:none;" stroke-width="8" stroke="black" />'
            + '<line  y1="0"   x1="64"  y2="42"  x2="64"  style="fill:none;" stroke-width="8" stroke="black" />'
            + '<line  y1="128" x1="64"  y2="86"  x2="64"  style="fill:none;" stroke-width="8" stroke="black" />',
            title
        );
    }

    public static DotDotDotIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean, title: string): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            ''
            ,

            '<rect x="18" y="36" width="18" height="18" style="fill:black" />'
            + '<rect x="54" y="36" width="18" height="18" style="fill:black" />'
            + '<rect x="90" y="36" width="18" height="18" style="fill:black" />'

            , title
        );
    }

    public static LogFileIcon(size: string, shadow: boolean, semitransparent: boolean, addIcon: boolean, deleteIcon: boolean): string
    {
        return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon,
            '',
            '<line x1="4" y1="24" x2="30" y2="24"     style=" stroke:black; stroke-width:8px;" />'
            + '<line x1="34" y1="24" x2="56" y2="24"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="64" y1="24" x2="74" y2="24"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="80" y1="24" x2="88" y2="24"    style=" stroke:black; stroke-width:8px; " />'

            + '<line x1="4" y1="40" x2="30" y2="40"     style=" stroke:black; stroke-width:8px;" />'
            + '<line x1="34" y1="40" x2="56" y2="40"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="61" y1="40" x2="90" y2="40"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="94" y1="40" x2="110" y2="40"    style=" stroke:black; stroke-width:8px; " />'

            + '<line x1="4" y1="56" x2="30" y2="56"     style=" stroke:black; stroke-width:8px;" />'
            + '<line x1="34" y1="56" x2="56" y2="56"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="61" y1="56" x2="86" y2="56"    style=" stroke:black; stroke-width:8px; " />'

            + '<line x1="4" y1="72" x2="30" y2="72"     style=" stroke:black; stroke-width:8px;" />'
            + '<line x1="34" y1="72" x2="50" y2="72"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="56" y1="72" x2="100" y2="72"    style=" stroke:black; stroke-width:8px; " />'

            + '<line x1="4" y1="88" x2="30" y2="88"     style=" stroke:black; stroke-width:8px;" />'
            + '<line x1="34" y1="88" x2="56" y2="88"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="61" y1="88" x2="72" y2="88"    style=" stroke:black; stroke-width:8px; " />'
            + '<line x1="78" y1="88" x2="106" y2="88"    style=" stroke:black; stroke-width:8px; " />'
        );
    }


//#ifndef READONLY
///*    public  static RESIZEHANDLE_TOPLEFT      = 0;
//    public  static RESIZEHANDLE_TOPCENTER    = 1;
//    public  static RESIZEHANDLE_TOPRIGHT     = 2;
//    public  static RESIZEHANDLE_CENTERRIGHT  = 3;
//    public  static RESIZEHANDLE_BOTTOMRIGHT  = 4;
//    public  static RESIZEHANDLE_BOTTOMCENTER = 5;
//    public  static RESIZEHANDLE_BOTTOMLEFT   = 6;
//    public  static RESIZEHANDLE_CENTERLEFT   = 7;
//    public  static RESIZEHANDLE_CENTER       = 8;
//
//    public  static RESIZEHANDLE_data : number[][] =
//      [[0,0,  0,7,  2,5,  7,10, 10,7,  5,2,  7,0   ],  // top left
//       [6,0,  11,5,  8,5,  8,12, 4,12,  4,5,  1,5  ],  // top center
//       [12,0, 12,7, 10,5, 5,10, 2,7,   7,2,  5,0   ],  // top right
//       [12,6, 7,11, 7,8,  0,8,  0,4,   7,4,  7,1 ],   // center right
//       [12,12,5,12, 7,10, 2,5,  5,2,   10,7,  12,5],   // bottom right
//       [6,12, 1,7,  4,7,  4,0,  8,0,   8,7,  11,7],   // bottom center
//       [0,12, 0,5,  2,7,  7,2,  10,5,   5,10,  7,12 ],  // bottom left
//       [0,6,  5,1,  5,4,  12,4, 12,8,  5,8,  5,11],   // center left
//       [6,0,  8,2,  7,2,  7,5, 10,5, 10,4,   12,6,   // center
//        10,8, 10,7, 7,7,  7,10, 8,10, 6,12,
//        4,10,  5,10,  5,7,  2,7, 2,8,  0,6,
//        2,4,  2,5,  5,5,  5,2, 4,2]];
//
//
//
//public static resizeHandleSVGcode(index : number , size: number, active:boolean ):string
//     {  let svg : string ='<svg  xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 '+size+' '+size+'">';
//         let x : number =0;
//         let y : number =0;
//         let r : number=size;
//         switch (index)
//       {  case  ressources.RESIZEHANDLE_TOPLEFT : break;
//           case  ressources.RESIZEHANDLE_TOPCENTER  : x = size/2;break;
//           case  ressources.RESIZEHANDLE_TOPRIGHT     : x=size;break;
//           case  ressources.RESIZEHANDLE_CENTERRIGHT  : x=size; y=size/2;break;
//           case  ressources.RESIZEHANDLE_BOTTOMRIGHT  : x=size;y=size;break;
//           case  ressources.RESIZEHANDLE_BOTTOMCENTER : x=size/2; y=size; break;
//           case  ressources.RESIZEHANDLE_BOTTOMLEFT   : y=size; break;
//           case  ressources.RESIZEHANDLE_CENTERLEFT   : y=size/2; break;
//           case  ressources.RESIZEHANDLE_CENTER       :  x=size/2;  y=size/2; r=size/2;break;
//
//       }
//      svg+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'"   style="fill:white;" opacity="0.75"/>';
//
//       svg+=   '<path d="';
//       let  l = ressources.RESIZEHANDLE_data[index].length>>1;
//       for (let i :number=0;i<l;i++)
//       {   let x :number  = 1+ ((size-2)*ressources.RESIZEHANDLE_data[index][i<<1]) /12.0;
//           let y :number  = 1+ ((size-2)*ressources.RESIZEHANDLE_data[index][1+(i<<1)])/12.0;
//
//           svg += i==0?'M ':'L '
//           svg += Math.round(x ).toString() +" "+  Math.round(y).toString()+ " ";
//       }
//        svg +='z" style="fill:'+(active?"LightGreen":"Gray")+'"/></svg>';
//       return svg;
//    }
//
// */
////#endif
}


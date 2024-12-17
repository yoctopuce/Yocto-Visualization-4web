Yocto-Visualization (for web)
=============================

## What is Yocto-Visualization (for web) good for ?

This application is a fully web-based version of our popular
[Yocto-Visualization V2](//www.yoctopuce.com/EN/article/yocto-visualization-user-s-guide) 
desktop application meant to quickly visualize data from Yoctopuce sensors.


![Snapshot](https://www.yoctopuce.com/pubarchive/2022-11/YV4WebScreenShot_1.png  "Yocto-Visualization (for web) running in a browser)")


It can easily be embedded in any web page to provide real-time
graphs of Yoctopuce sensors, including datalogger access.

The source code include some preprocessor directive encoded
within [TypeScript](//www.typescriptlang.org) comments (aka //#ifdef ... //#endif)
to produce a read-only version of the application, without the
code needed to configure widgets. The build process can therefore
build two different minified versions: full and read-only.

## Folder structure 
```
src/**          full source code (TypeScript)
obj/debug/**	default location for transpiled code, for debug purposes
obj/full/**     preprocessor output and transpiled files, full version
obj/rdonly/**	preprocessor output and transpiled files, read-only version
dist/es2015/**	production code (both regular and minified), compatible with EcmaScript 2015+
dist/es2017/**	production code (both regular and minified), compatible with EcmaScript 2017+
bin/**          build tools and debugging tools
```

## How to compile it ?

If you need to rebuild, make sure [Node.js](//nodejs.org) is installed on your
computer, go to the archive top level and type:

```	
npm install 
npm run build
```
	
## How to test it ?
After compilation You are supposed to  upload the contents of es2015 or
es2017 to a web server. If you don't have any web server at hand, we provided
a simple one for testing purpose , just go to the top level and type:

```   
npm run app-server
```

This will start a web browser with a demo, you will not be able to properly
save  because in this demo there is nowhere to save the configuration.

   
## How to install it (on a Yoctopuce Hub)?
We provided an installer allowing an easy install on
[YoctoHub](//www.yoctopuce.com/EN/products/category/extensions-and-networking), 
[Virtualhub](//www.yoctopuce.com/EN/virtualhub.php) and  
[Virtualhub (for web)](//www.yoctopuce.com/EN/tools.php).
Just go to the top level and type:


```
npm run installer
```
  
Note: if YoctoVisualisation must be run on a  Virtualhub (native version), the
virtualhub filesystem must be enabled: make sure the virtualhub is started 
with the -F option. 

The same installer is also available from the [Yoctopuce tool page](//www.yoctopuce.com/EN/tools).

## Acknowledgements
Yocto-Visualization (for web) uses the
[PAKO javascript library](//github.com/nodeca/pako)
by Vitaly Puzrin and Andrei Tuputcyn,  ported to 
[TypeScript](//www.typescriptlang.org) by Yoctopuce.


## License information

Copyright (C) 2015 and beyond by Yoctopuce Sarl, Switzerland.

Yoctopuce Sarl (hereafter Licensor) grants to you a perpetual
non-exclusive license to use, modify, copy and integrate this
file into your software for the sole purpose of interfacing
with Yoctopuce products.

You may reproduce and distribute copies of this file in
source or object form, as long as the sole purpose of this
code is to interface with Yoctopuce products. You must retain
this notice in the distributed source file.

You should refer to Yoctopuce General Terms and Conditions
for additional information regarding your rights and
obligations.

THE SOFTWARE AND DOCUMENTATION ARE PROVIDED "AS IS" WITHOUT
WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
WITHOUT LIMITATION, ANY WARRANTY OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO
EVENT SHALL LICENSOR BE LIABLE FOR ANY INCIDENTAL, SPECIAL,
INDIRECT OR CONSEQUENTIAL DAMAGES, LOST PROFITS OR LOST DATA,
COST OF PROCUREMENT OF SUBSTITUTE GOODS, TECHNOLOGY OR
SERVICES, ANY CLAIMS BY THIRD PARTIES (INCLUDING BUT NOT
LIMITED TO ANY DEFENSE THEREOF), ANY CLAIMS FOR INDEMNITY OR
CONTRIBUTION, OR OTHER SIMILAR COSTS, WHETHER ASSERTED ON THE
BASIS OF CONTRACT, TORT (INCLUDING NEGLIGENCE), BREACH OF
WARRANTY, OR OTHERWISE.


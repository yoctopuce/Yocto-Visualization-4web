// This script is intended to be used from the package root (lib directory), from npm scripts.
//
// Usage:
//
//   npm run build
//   => bump version number to next pre-release suffix and update index.js
//
//   npm run build -- 1.10.21818
//   => set official version number and update index.js
//
import * as fs from 'fs';
import * as semver from 'semver';
import * as ts from 'typescript';
import * as process from 'process';
import * as esbuild from 'esbuild';
import * as Pako from "../src/Pako/Pakofull.js"

function patchVersionInFile(newver: string, str_filename: string)
{
    let pattern: string = '/* version number patched automatically */';
    let jsFile: Buffer = fs.readFileSync(str_filename);
    let pos: number = jsFile.indexOf(pattern);
    if(pos < 0) {
        console.log('*** Warning, cannot patch '+ str_filename+', pattern not found !');
    } else {
        pos += pattern.length;
        let endMark: number = jsFile.indexOf(';', pos);
        let patch: string = "'" + newver + "'";
        let res: Buffer = Buffer.alloc(pos + patch.length + jsFile.length-endMark);
        jsFile.copy(res, 0, 0, pos);
        res.write(patch, pos);
        jsFile.copy(res, pos + patch.length, endMark);
        fs.writeFileSync(str_filename, res);
    }
}

function setVersion(str_newver: string)
{
    // update version number is package.json
    let json: { version: string } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    let newver: string | null;
    console.log('Was at version ' + json.version);
    if (str_newver) {
        // argument is new version number
        newver = semver.clean(str_newver);
    } else {
        // bump local revision number
        newver = <string>semver.inc(json.version, 'prerelease', 'dev');
    }
    if (!newver) {
        console.log('Invalid version number: ' + process.argv[2]);
        process.exit(1);
    }
    console.log('Now at version ' + newver);
    json.version = newver;
    fs.writeFileSync("package.json", JSON.stringify(json, null, 2), 'utf-8');

    // update version number in yocto_api.ts
    patchVersionInFile(newver, 'src/constants.ts');
}

function findFilesRecursively(path: string, pattern: RegExp): string[]
{
    let result: string[] = [];
    fs.readdirSync(path).forEach((name: string) => {
        if(name[0] != '.') {
            let subpath: string = path + '/' + name;
            if(fs.statSync(subpath).isDirectory()) {
                result.push(...findFilesRecursively(subpath, pattern));
            } else if(pattern.test(name)){
                result.push(subpath);
            }
        }
    })
    return result;
}

function preprocess(srcdir: string, objdir: string, defines: string[])
{
    console.log('Preprocessing to '+objdir+'...');
    let inputFiles: string[] = findFilesRecursively(srcdir, /\.ts$/);
    for(let i = 0; i < inputFiles.length; i++) {
        let content: string = fs.readFileSync(inputFiles[i]).toString('utf-8');
        let pattern: RegExp = /\/\/#\s*((ifn?def)\s+(\w+)|endif)/g;
        let execarr: RegExpExecArray | null;
        let stack: boolean[] = [ true ];
        let prevpos: number = 0;
        let result: string = '';
        while ((execarr = pattern.exec(content)) !== null) {
            if(stack[stack.length-1]) {
                // previous segment is included
                result += content.slice(prevpos, execarr.index);
            } else {
                // previous segment is excluded, comment out every line
                result += content.slice(prevpos, execarr.index).replace(/\n/g, '\n//');
            }
            if(execarr[2]) {
                // #ifdef <symbol>
                // #infdef <symbol>
                let cmd: string = execarr[2];
                let sym: string = execarr[3];
                stack.push((cmd == 'ifdef') == defines.includes(sym));
            } else {
                // #endif
                if(stack.length <= 1) {
                    console.error('ERROR: unmatched #endif in '+inputFiles[i]+' at offset '+execarr.index);
                } else {
                    stack.pop();
                }
            }
            prevpos = execarr.index;
        }
        if(stack.length > 1) {
            console.error('ERROR: missing #endif in '+inputFiles[i]);
        }
        if(prevpos == 0) {
            result = content;
        } else {
            result += content.slice(prevpos);
        }
        let dstpath = objdir+inputFiles[i].slice(srcdir.length);
        fs.mkdirSync(dstpath.slice(0,dstpath.lastIndexOf('/')),{ recursive: true });
        fs.writeFileSync(dstpath, result, 'utf-8');
    }
}

function transpile(objdir: string, target: string)
{
    const cwd: string = process.cwd().replace(/\\/g, '/');
    let options: ts.CompilerOptions = {
        strict: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        "outDir":objdir
    };
    switch(target) {
        case 'es2015': options.target = ts.ScriptTarget.ES2015; break;
        case 'es2017': options.target = ts.ScriptTarget.ES2017; break;
    }
    // Compile all .ts files within src
    console.log('Transpiling '+objdir+' TypeScript files for '+target+'...');
    let inputFiles: string[] = findFilesRecursively(objdir, /\.ts$/);
    let program = ts.createProgram(inputFiles, options);
    let emitResult = program.emit();
    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    console.log(allDiagnostics.length+' messages generated by TypeScript compiler');
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });
}

async function bundleRenderer(objdir: string, target: string, banner: string)
{
    // old JS-compatible package formet es2015 version (no need for esm module)
    let fmt: esbuild.Format = (target == 'es2015' ? 'iife' : 'esm');
    await esbuild.build({
        entryPoints: [objdir+'/Renderer/YDataRendererFull.js'],
        bundle: true,
        target: target,
        format: fmt,
        globalName: 'Renderer',
        sourcemap: false,
        banner: banner,
        outfile: 'dist/'+target+'/yv4web-renderer.js',
    });
    await esbuild.build({
        entryPoints: [objdir+'/Renderer/YDataRendererFull.js'],
        bundle: true,
        target: target,
        format: fmt,
        globalName: 'Renderer',
        sourcemap: false,
        minify: true,
        banner: banner,
        outfile: 'dist/'+target+'/yv4web-renderer.min.js',
    });
}

async function bundle(objdir: string, target: string, bundleName: string, banner: string)
{
    await esbuild.build({
        entryPoints: [objdir+'/webPage.js'],
        bundle: true,
        target: target,
        format: 'esm',
        sourcemap: true,
        banner: banner,
        outfile: 'dist/'+target+'/'+bundleName+'.js',
    });
    await esbuild.build({
        entryPoints: [objdir+'/webPage.js'],
        bundle: true,
        target: target,
        format: 'esm',
        sourcemap: false,
        minify: true,
        banner: banner,
        outfile: 'dist/'+target+'/'+bundleName+'.min.js',
    });
}

interface YStringDict {
    [ident: string] : string;
}

async function bundleInstaller(objdir: string, target: string, bundleName: string, banner: string)
{
    let objectFiles: YStringDict = {
        'ro_js': 'dist/' + target + '/yv4web-readonly.js',
        'rw_js': 'dist/' + target + '/yv4web-full.js',
        'ro_minjs': 'dist/' + target + '/yv4web-readonly.min.js',
        'rw_minjs': 'dist/' + target + '/yv4web-full.min.js'
    };
    let blobFile =
        '/* This file is generated by build.ts. It contains all yv4web modules, gzip+uuencoded */\n'+
        'export class BinariesBlobs {}\n';
    for(let blobName in objectFiles) {
        let bincontents = fs.readFileSync(objectFiles[blobName]);
        let zipcontents = <Uint8Array>Pako.Pako_Deflate.gzip(bincontents, {level: 9});
        let uucontents = Buffer.from(zipcontents).toString('base64');
        blobFile += 'BinariesBlobs.'+blobName+' = "'+uucontents+'";\n';
    }
    fs.writeFileSync(objdir + '/YoctoVisualizationBinaries.js', blobFile);
    await esbuild.build({
        entryPoints: [objdir+'/installer_rw.js'],
        bundle: true,
        target: target,
        format: 'esm',
        sourcemap: true,
        banner: banner,
        outfile: 'dist/'+target+'/'+bundleName+'.js',
    });
    await esbuild.build({
        entryPoints: [objdir+'/installer_rw.js'],
        bundle: true,
        target: target,
        format: 'esm',
        sourcemap: false,
        minify: true,
        banner: banner,
        outfile: 'dist/'+target+'/'+bundleName+'.min.js',
    });
}

async function cleanup(full: boolean)
{
    // Cleanup intermediate object files
    let objFiles: string[] = findFilesRecursively('obj', /\.(ts|js|map)$/);
    for(let file of objFiles) {
        fs.unlinkSync(file);
    }

    if(full) {
        // Cleanup all files
        let distFiles: string[] = findFilesRecursively('dist', /\.(js|map)$/);
        for(let file of distFiles) {
            fs.unlinkSync(file);
        }
    }

    fs.unlinkSync('bin/build.js.map');
    fs.unlinkSync('bin/build.js');
}

let args: string[] = process.argv.slice(2);
if(args.length == 0) {
    console.log("command expected")
} else {
    switch(args[0])
    {
    case "newbuild":
        setVersion(args[1]);
        break;
    case "build":
        let json: { version: string } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        console.log('Building version ' + json.version);
        let buildES2015: boolean = (args.length < 2 || args[1] == 'es2015');
        let buildES2017: boolean = (args.length < 2 || args[1] == 'es2017');
        preprocess('src', 'obj/full', []);
        preprocess('src', 'obj/rdonly', ['READONLY']);
        if (buildES2015)
        {
            transpile('obj/full', 'es2015');
            transpile('obj/rdonly', 'es2015');
            bundleRenderer('obj/rdonly', 'es2015', '/* Yocto-Visualization-4web renderer library (ES2015 ' + json.version + ') - www.yoctopuce.com */');
            bundle('obj/rdonly', 'es2015', 'yv4web-readonly', '/* Yocto-Visualization-4web (ES2015 read-only ' + json.version + ') - www.yoctopuce.com */');
            bundle('obj/full', 'es2015', 'yv4web-full', '/* Yocto-Visualization-4web (ES2015 full ' + json.version + ') - www.yoctopuce.com */');
        }
        if (buildES2017)
        {
            transpile('obj/full', 'es2017');
            transpile('obj/rdonly', 'es2017');
            bundleRenderer('obj/rdonly', 'es2017', '/* Yocto-Visualization-4web renderer library (ES2017 ' + json.version + ') - www.yoctopuce.com */');
            Promise.all([
                bundle('obj/rdonly', 'es2017', 'yv4web-readonly', '/* Yocto-Visualization-4web (ES2017 read-only ' + json.version + ') - www.yoctopuce.com */'),
                bundle('obj/full', 'es2017', 'yv4web-full', '/* Yocto-Visualization-4web (ES2017 full ' + json.version + ') - www.yoctopuce.com */')
            ]).then(() =>
            {
                bundleInstaller('obj/full', 'es2017', 'yv4web-installer', '/* Yocto-Visualization-4web installer (version ' + json.version + ') - www.yoctopuce.com */');
            });
        }
        break;
    case "cleanup-release":
        cleanup(false);
        break;
    case "cleanup-full":
        cleanup(true);
        break;
    }
}


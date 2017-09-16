// breakpoint.js
// use node --debug to enter node-inspector

// where is --debug-brk and --debug documented?

// if node is started with
// node --debug-brk file.js
// then, with node-inspector running and a browser at localhost:8080
// will debug similar to web inspector

// to debug with nodeunit
// insert a debugger statement in your test or the code being tested
// node --debug-brk $(which nodeunit) test/test-scrub.js
// reload node-inspector, click go and you stop at the debugger statement

// the --debug option does not work with node-inspector

// if node is started with
// node --debug-brk file.js
// and encounters the JavaScript statement debugger
// this behaves like a breakpoint
innerFunc()
function innerFunc() {
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	console.log(func)
	//debugger
}

/*
node --help does not explain debug options
node --v8-options neither does explain those options
node --vars prints nothing

$ node --help
Usage: node [options] [ -e script | script.js ] [arguments] 
       node debug script.js [arguments] 

Options:
  -v, --version        print node's version
  -e, --eval script    evaluate script
  -p, --print          print result of --eval
  --v8-options         print v8 command line options
  --vars               print various compiled-in variables
  --max-stack-size=val set max v8 stack size (bytes)

Environment variables:
NODE_PATH              ':'-separated list of directories
                       prefixed to the module search path.
NODE_MODULE_CONTEXTS   Set to 1 to load modules in their own
                       global contexts.
NODE_DISABLE_COLORS    Set to 1 to disable colors in the REPL

Documentation can be found at http://nodejs.org/
*/
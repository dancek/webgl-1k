/*
 * My try at making a 1k WebGL demo.
 *
 * I'm very much in debt to http://www.bitsnbites.eu/?p=112
 *
 * Useful packers:
 * http://closure-compiler.appspot.com/home
 * http://crunchme.bitsnbites.eu/
 * http://iteral.com/jscrush/
 * https://github.com/cowboy/javascript-packify
 * http://advsys.net/ken/utils.htm
 *
 * Useful reading:
 * http://www.p01.org/releases/
 * http://daeken.com/superpacking-js-demos
 *
 * http://www.iquilezles.org/apps/shadertoy/
 */

var initTime = new Date().valueOf();
// SHADERS
// vertex shader is just a pass-through
var p = [],
    v = "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}",
    f = [
// shader 1
'precision highp float;'+
'uniform float t;'+
'uniform vec2 w;'+

'void main(void) {'+
'vec2 p=-1.0+2.0*gl_FragCoord.xy/w.xy;'+
'float r=abs(sin(exp(p.x)*p.y+t/1.4));'+
'float g=abs(sin(p.x*exp(p.y)+t/1.2));'+
'float b=abs(sin(p.x*p.y+t/1.7));'+
'gl_FragColor=vec4(r,g,b,1.0);'+
'}'
    ],
    gl, mCanvas, mWidth, mHeight;

    var VERTEX_SHADER = 0x8B31,
        FRAGMENT_SHADER = 0x8B30,
        ARRAY_BUFFER = 0x8892,
        STATIC_DRAW = 0x88E4,
        COLOR_BUFFER_BIT = 0x4000,
        TRIANGLE_STRIP = 5,
        FLOAT = 0x1406;

    var main = function()
    {
            var w=800, h=600;
            mCanvas.width = w;
            mCanvas.height = h;
            gl.viewport(0, 0, w, h);
            
            // Timeline
            var t = (new Date().valueOf() - initTime)/1000;
            var prg = p[0]; // NOTE: This is the first part
            //for (var i = 0; t > parts[i][0]; i++) prg = p[parts[i][1]];
            gl.useProgram(prg);

            // Set time and screen size for the animation
            gl.uniform1f(gl.getUniformLocation(prg, "t"), t);
            gl.uniform2f(gl.getUniformLocation(prg, "w"), w, h);

            // Draw
            gl.drawArrays(TRIANGLE_STRIP, 0, 4);
    };

    // TODO: write my own startup instead of the ones ripped from frank
    // App startup
    (function ()
    {
//        try
//        {
            // Init WebGL context
            mCanvas = document.createElement("canvas");
            document.body.appendChild(mCanvas);
            var s = mCanvas.style;
            s.position = "fixed";
            s.left = s.top = 0;
            gl = mCanvas.getContext('experimental-webgl');
//            if (!gl)
//            {
//                alert("This demo requires WebGL");
//                return;
//            }

            // Init shaders
            for (var i = 0, j; i < 8; ++i)
            {
                p[i] = gl.createProgram();

                j = gl.createShader(VERTEX_SHADER);
                gl.shaderSource(j, v);
                gl.compileShader(j);
//                if (!gl.getShaderParameter(j, gl.COMPILE_STATUS)) alert("Vertex shader  "+ i + ": "+ gl.getShaderInfoLog(j));
                gl.attachShader(p[i], j);

                j = gl.createShader(FRAGMENT_SHADER);
                gl.shaderSource(j, f[i]);
                gl.compileShader(j);
//                if (!gl.getShaderParameter(j, gl.COMPILE_STATUS)) alert("Fragment shader  "+ i + ": "+ gl.getShaderInfoLog(j));
                gl.attachShader(p[i], j);

                gl.linkProgram(p[i]);
//                if (!gl.getProgramParameter(p[i], gl.LINK_STATUS)) alert("Link program  "+ i + ": "+ gl.getProgramInfoLog(p[i]));
            }

            // Init vertex buffer for a regular screen-sized quad
            var vertices = [-1,-1, -1,1, 1,-1, 1,1];
            gl.bindBuffer(ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(ARRAY_BUFFER, new Float32Array(vertices), STATIC_DRAW);

            // Set up position attribute
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, FLOAT, false, 0, 0); // position

            // synthesize music
            var softSynth = function(f){return eval("for(var t=0,S='RIFF_oO_WAVEfmt "+atob('EAAAAAEAAQAiVgAAIlYAAAEACAA')+"data';++t<3e6;)S+=String.fromCharCode("+f+")")}
            //var softSynth = function(f){for(var t=0,S='RIFF_oO_WAVEfmt '+atob('EAAAAAEAAQBAHwAAQB8AAAEACAA')+'data';++t<3e5;)S+=String.fromCharCode(eval(f));return S};
            // header parts for different bitrates (padding isn't needed)
            // 8000:  'EAAAAAEAAQBAHwAAQB8AAAEACAA='
            // 22050: 'EAAAAAEAAQAiVgAAIlYAAAEACAA='
	
new Audio( 'data:audio/wav;base64,'+btoa( softSynth( '((t>>5)^64+(t>>1&t>>7)&(t>>75)*(t<4e5?4:t&224)/4)&255' ) ) ).play();
            // Start the main loop
            setInterval(main, 1);
//        }
//        catch (err)
//        {
//            alert("Error initializing: " + err.message);
//        }
    })();

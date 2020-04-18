(function(){
    window.addEventListener("DOMContentLoaded", () => {
        window.webgl = document.querySelector("canvas").getContext("webgl");
        
        if(window.webgl == null){
            alert("webgl is not supported!");
            window.close();
            return;
        }
        const vsSource = `
            attribute vec4 aVertexPosition;
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            void main(){
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            }`;
        
        const fsSource = `
            void main(){
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }`;
        
        console.dir(window.webgl);
        
        window.webgl.clearColor(0, 0, 0, 1.0);
        window.webgl.clear(window.webgl.COLOR_BUFFER_BIT);
        
        const shaderProgram = initShaderProgram(window.webgl, vsSource, fsSource);
        
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: window.webgl.getAttribLocation(shaderProgram, "aVertexPosition")
            },
            uniformLocations: {
                projectionMatrix: window.webgl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: window.webgl.getUniformLocation(shaderProgram, "uModelViewMatrix")
            }
        }
    });
    
    function initShaderProgram(webgl, vsSource, fsSource){
        const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fsSource);
        
        const shaderProgram = webgl.createProgram();
        webgl.attachShader(shaderProgram, vertexShader);
        webgl.attachShader(shaderProgram, fragmentShader);
        webgl.linkProgram(shaderProgram);
        
        //if creating the shader program failed, alert
        if(webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS) == null){
            alert("Unable to initialize the shader program: " + webgl.getProgramInfoLog(shaderProgram));
            return null;
        }
        
        return shaderProgram;
    }
    
    function loadShader(webgl, type, source){
        const shader = webgl.createShader(type);
        
        //send the source to the shader object
        webgl.shaderSource(shader, source);
        
        //compile the shader program
        webgl.compileShader(shader);
        
        if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + webgl.getShaderInfoLog(shader));
            webgl.deleteShader(shader);
            return null;
        }

        return shader;
    }
    
    function initBuffers(webgl) {

        //create a buffer for the square's positions
        const positionBuffer = webgl.createBuffer();

        //select the positionBuffer as the one to apply buffer
        //operations to from here out.

        webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);

        //now create an array of position for the square
        const positions = [
            -1.0,  1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0, -1.0,
        ];

        //Now pass the list of positions into WebGL to build the
        //shape. We do this by creating a Float32Array from the
        //JavaScript array, then use it to fill the current buffer.

        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);

        return {position: positionBuffer};
    }

    function drawScene(webgl, programInfo, buffers) {
        webgl.clearColor(0, 0, 0, 1);   //clear to black, fully opaque
        webgl.clearDepth(1);    //clear everything
        webgl.enable(webgl.DEPTH_TEST); //enable depth testing
        webgl.depthFunc(webgl.LEQUAL);  //near things obscure far things

        //clear the canvas before we start drawing on it

        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

        //Create a perspective matrix, a special matrix that is
        //used to simulate the distortion of perspective in a camera.
        //Our field of view is 45 degrees, with a width/height
        //ratio that matches the display size of the canvas
        //and we only want to see objects between 0.1 units
        //and 100 units away from the camera.

        const fieldOfView = 45 * Math.PI / 180; // in radians
        const aspect = webgl.canvas.clientWidth / webgl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        //Set the drawing position to the "identity" point, which is
        //the center of the scene.
        const modelViewMatrix = mat4.create();

        //Now move the drawing position a bit to where we want to
        //start drawing the square.

        mat4.translate(modelViewMatrix,     //destination matrix
                        modelViewMatrix,    //matrix to translate
                        [-0.0, 0.0, -6.0]); //amount to translate

        //Tell WebGL how to pull out the positions from the position
        //buffer into the vertexPosition attribute.
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = webgl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                      // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.position);
            webgl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            webgl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing

        webgl.useProgram(programInfo.program);

        // Set the shader uniforms

        webgl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        webgl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            webgl.drawArrays(webgl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
})();
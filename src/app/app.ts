import {Vertex} from "./vertex.js";
import vertCode from "./shaders/vert.js"
import fragCode from "./shaders/frag.js"
import {STLModel} from "./parse_stl.js"
import {getProgram} from "./shaders/program.js"
import {loadTexture} from "./texture.js"
import {perspectiveMatrix, multiplyMatrices, translateMatrix, rotateYMatrix, multiplyArrayOfMatrices, rotateXMatrix} from "./matrix.js"

let canvas: HTMLCanvasElement;
window.onresize = (ev) => {
    canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onload = async () => {
    let gl = document.getElementsByTagName("canvas")[0].getContext("webgl");

    if (gl === null) {
        alert("Webgl not supported");
        return; 
    }

    let teapot = new STLModel("../teapot.stl");
    await teapot.loaded;

    let verts: Vertex[] = teapot.parseTriangles();

    let stride = 8;
    let trig = new Float32Array(verts.length * stride); 

    for (let i = 0; i < verts.length; i++) {
        const vert = verts[i];
        trig[i * stride] = vert.pos[0];
        trig[i * stride + 1] = vert.pos[1];
        trig[i * stride + 2] = vert.pos[2];
        trig[i * stride + 3] = vert.normal[0];
        trig[i * stride + 4] = vert.normal[1];
        trig[i * stride + 5] = vert.normal[2];
        trig[i * stride + 6] = vert.uv[0];
        trig[i * stride + 7] = vert.uv[1];
    }
    stride *= 4; // float is 4 bytes

	let VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, trig, gl.STATIC_DRAW);
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK); 

    let aspect = window.innerWidth / window.innerHeight;    
    let proj = perspectiveMatrix(70 * (Math.PI / 180), aspect, 1, 2000);
    let view = multiplyArrayOfMatrices([translateMatrix(0, -5, -20), rotateXMatrix(-20 * (Math.PI / 180))]);
    let model = translateMatrix(0, 0, 0);

    let shaderProgram = getProgram(gl, vertCode, fragCode);
    if (shaderProgram == undefined) 
        return;

    let obama = loadTexture(gl, "../obama.png");
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let posLoc = gl.getAttribLocation(shaderProgram, "aPos");
    let uvLoc = gl.getAttribLocation(shaderProgram, "uv");
    let normLoc = gl.getAttribLocation(shaderProgram, "norm");
    
    let current = 0;
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride, current);
    gl.enableVertexAttribArray(posLoc);
    current += 4 * 3;

    gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, stride, current);
    gl.enableVertexAttribArray(normLoc);
    current += 4 * 3;

    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, stride, current);
    gl.enableVertexAttribArray(uvLoc);
    current += 4 * 2;

    gl.useProgram(shaderProgram);

    let textureLoc = gl.getUniformLocation(shaderProgram, "uSampler");
    let mLoc = gl.getUniformLocation(shaderProgram, "model");
    let vLoc = gl.getUniformLocation(shaderProgram, "view");
    let pLoc = gl.getUniformLocation(shaderProgram, "proj");
    gl.activeTexture(gl.TEXTURE0);

    setInterval(() => {
        if (gl == null || shaderProgram == undefined) {
            return;
        }

        model = multiplyMatrices(model, rotateYMatrix(1 * (Math.PI / 180)));
        let goodmodel = multiplyMatrices(model,rotateXMatrix(90 * (Math.PI / 180)));

        gl.uniformMatrix4fv(mLoc, false, goodmodel);
        gl.uniformMatrix4fv(vLoc, false, view);
        gl.uniformMatrix4fv(pLoc, false, proj);
        
        gl.bindTexture(gl.TEXTURE_2D, obama);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(textureLoc, 0);
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        
        gl.drawArrays(gl.TRIANGLES, 0, verts.length);
    }, 1000/ 60)
};

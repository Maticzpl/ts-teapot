export function getProgram(gl: WebGLRenderingContext, vertCode: string, fragCode: string): WebGLProgram | undefined {
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (vertexShader == null)  {
        console.error("Vert shader suicido");
        return;
    }
    gl.shaderSource(vertexShader, vertCode);
    gl.compileShader(vertexShader);
    var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!compiled)
        console.error('Vert compile log: ' + gl.getShaderInfoLog(vertexShader));

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (fragmentShader == null)  {
        console.error("Frag shader suicido");
        return;
    }
    gl.shaderSource(fragmentShader, fragCode);
    gl.compileShader(fragmentShader);
    var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!compiled)
        console.error('Frag compile log: ' + gl.getShaderInfoLog(fragmentShader));

    let shaderProgram = gl.createProgram();
    if (shaderProgram == null) {
        console.error("Shader program suicido");
        return;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const linkErrLog = gl.getProgramInfoLog(shaderProgram);
        console.error(`Shader program error ${linkErrLog}`);
        return;
    }

    return shaderProgram;
}

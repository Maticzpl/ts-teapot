const CODE = `
#version 100
precision mediump float;

attribute vec3 aPos; 
attribute vec2 uv; 
attribute vec3 norm; 

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

varying highp vec2 UV;
varying highp vec3 Norm;

void main() {
    gl_Position = proj * view * model * vec4(aPos, 1.0);
    UV = uv;
    Norm = norm;
}
`;

export default CODE;
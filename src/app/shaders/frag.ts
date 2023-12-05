const CODE = `
#version 100
precision mediump float;
uniform sampler2D uSampler;

uniform mat4 model;

varying highp vec2 UV; 
varying highp vec3 Norm; 

void main() {
    float bright = dot(Norm, vec3(vec4(1.0, 1.0, 1.0, 0.0) * model)) / 2.0 + 0.5;
    vec4 col = vec4(vec3(1.0, 1.0, 1.0) * bright * 0.8, 1.0) * texture2D(uSampler, UV);
    // col += vec4(0, UV, 0);
    gl_FragColor = col;
}
`;

export default CODE;
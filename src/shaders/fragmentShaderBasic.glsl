// fragmentShaderBasic.glsl

precision mediump float;

uniform vec3 u_color;
uniform float u_time;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec3 color = vec3(0.52, 0.0, 1.0); 
    fragColor = vec4(color, 1.0);
}

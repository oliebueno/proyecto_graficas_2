// fragmentShaderBasic.glsl

precision mediump float;

uniform vec3 u_color;
uniform float u_time;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec3 color = vec3(1.0, 0.0, 0.0); 
    color = mix(color, u_color, 0.5);

    float pulse = sin(u_time * 2.0) * 0.5 + 0.5;
    fragColor = vec4(color * pulse, 1.0);
}

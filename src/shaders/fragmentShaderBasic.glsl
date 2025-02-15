precision mediump float;

// Uniform
uniform vec3 u_materialColor;
uniform float u_time;

// Varying
out vec4 fragColor;

vec3 normalizeColor(vec3 color) {
    return color / 255.0;
}

void main() {
    vec3 color = normalizeColor(u_materialColor);

    fragColor = vec4(color, 1.0);
}
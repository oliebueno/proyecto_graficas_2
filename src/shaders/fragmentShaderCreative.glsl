precision mediump float;

// Uniforms
uniform vec3 u_materialColor;
uniform vec3 u_lightColor;
uniform float u_time;
uniform float u_frequency; // Frequency for color distortion
uniform float u_audioFrequency; // Audio frequency

// Varyings
in vec3 v_normal;
in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 distortedColor = u_materialColor * (0.5 + 0.5 * sin(u_frequency * v_uv.x + u_time * u_audioFrequency));
    vec3 finalColor = diff * u_lightColor * distortedColor;

    fragColor = vec4(finalColor, 1.0);
}

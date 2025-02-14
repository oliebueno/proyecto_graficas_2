precision mediump float;

// Uniforms
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform vec3 u_outlineColor;
uniform float u_levels;

// Varyings
in vec3 v_normal;
in vec3 v_viewPosition;
in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec3 normalizedNormal = normalize(v_normal);
    vec3 viewDirection = normalize(v_viewPosition);

    // Diffuse shading
    float lightIntensity = max(dot(normalizedNormal, vec3(0, 0, 1)), 0.0);
    lightIntensity = floor(lightIntensity * u_levels) / u_levels;

    // Toon shading color
    vec3 color = u_materialColor * lightIntensity;

    // Outline effect
    float edge = max(dot(normalizedNormal, viewDirection), 0.0);
    if (edge < 0.1) {
        color = u_outlineColor;
    }

    fragColor = vec4(color, 1.0);
}

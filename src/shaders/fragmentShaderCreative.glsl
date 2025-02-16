precision mediump float;

// Uniforms
uniform vec3 u_materialColor;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
uniform float u_shininess;
uniform float u_time;
uniform float u_frequency; // Frequency for color distortion
uniform float u_audioFrequency; // Audio frequency
uniform float u_audioAmplitude; // Audio amplitude

// Varyings
in vec3 v_normal;
in vec3 v_viewPosition;
in vec3 v_lightDirection;
out vec4 fragColor;

vec3 normalizeColor(vec3 color) {
    return color / 255.0;
}

void main() {
    vec3 normalizedNormal = normalize(v_normal);
    vec3 normalizedLightDirection = normalize(v_lightDirection);
    vec3 normalizedViewDirection = normalize(v_viewPosition);

    // Normalize colors
    vec3 materialColor = normalize(u_materialColor);
    vec3 lightColor = normalize(u_lightColor);
    vec3 specularColor = normalize(u_specularColor);

    // Ambient
    vec3 ambient = 0.1 * materialColor;

    // Diffuse components
    float diff = max(dot(normalizedNormal, normalizedLightDirection), 0.0);
    vec3 diffuse = diff * lightColor * materialColor;

    // Specular components
    vec3 halfVector = normalize(normalizedLightDirection + normalizedViewDirection);
    float spec = pow(max(dot(normalizedNormal, halfVector), 0.0), u_shininess);
    vec3 specular = lightColor * specularColor * spec;

    // Audio pulsing effect
    float pulse = 0.5 + 0.1 * sin(u_audioFrequency * u_time) * u_audioAmplitude * u_frequency;

    // Combine lighting components and pulse effect
    vec3 finalColor = ambient + (diffuse + specular) * pulse;
    
    fragColor = vec4(finalColor, 1.0);
}


precision mediump float;

// Uniforms
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform vec3 u_specularColor;
uniform float u_shininess;
uniform float u_time;

// Varyings
in vec3 v_normal;
in vec3 v_viewPosition;
in vec3 v_lightDirection;
in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec3 normalizedNormal = normalize(v_normal);
    vec3 normalizedLightDirection = normalize(v_lightDirection);
    vec3 normalizedViewDirection = normalize(v_viewPosition);

    // Ambient
    vec3 ambient = 0.1 * u_materialColor;

    // Diffuse
    float diff = max(dot(normalizedNormal, normalizedLightDirection), 0.0);
    vec3 diffuse = diff * u_lightColor * u_materialColor;

    // Specular
    vec3 halfVector = normalize(normalizedLightDirection + normalizedViewDirection);
    float spec = pow(max(dot(normalizedNormal, halfVector), 0.0), u_shininess);
    vec3 specular = u_lightColor * u_specularColor * spec;

    // Add a creative effect: a moving wave texture
    float wave = sin(v_uv.x * 10.0 + u_time * 2.0) * 0.5 + 0.5;
    vec3 waveEffect = vec3(wave, wave, wave);

    vec3 finalColor = ambient + diffuse + specular + waveEffect;
    fragColor = vec4(finalColor, 1.0);
}



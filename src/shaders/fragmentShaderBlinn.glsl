precision mediump float;

// Uniforms
uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform vec3 u_specularColor;
uniform float u_shininess;
uniform sampler2D u_texture;
uniform bool u_useTexture;

// Varyings
in vec3 v_normal;
in vec3 v_viewPosition;
in vec3 v_lightDirection;
in vec2 v_uv;
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
    vec3 ambient = 0.2 * materialColor;

    // Diffuse components
    float diff = max(dot(normalizedNormal, normalizedLightDirection), 0.0);
    vec3 diffuse = diff * lightColor * materialColor;

    // Specular components
    vec3 halfVector = normalize(normalizedLightDirection + normalizedViewDirection);
    float spec = pow(max(dot(normalizedNormal, halfVector), 0.0), u_shininess);
    vec3 specular = lightColor * specularColor * spec;

    // Apply texture
    vec3 finalColor = ambient + specular + diffuse;
    if (u_useTexture) {
        vec4 textureColor = texture(u_texture, v_uv);
        finalColor = textureColor.rgb * finalColor.rgb;
    }

    fragColor = vec4(finalColor, 1.0);
}



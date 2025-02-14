precision mediump float;

uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform vec3 u_specularColor;
uniform float u_shininess;
uniform vec3 u_lightPosition;
uniform float u_time;

in vec3 v_normal;
in vec3 v_position;
in vec2 v_uv;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_lightPosition - v_position);
    vec3 viewDir = normalize(-v_position);
    vec3 reflectDir = reflect(-lightDir, normal);
    
    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor * u_materialColor;
    
    // Specular component (Blinn-Phong)
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), u_shininess);
    vec3 specular = spec * u_lightColor * u_specularColor;
    
    // Combine components
    vec3 color = diffuse + specular;
    
    // Pulse effect based on time
    float pulse = sin(u_time * 2.0) * 0.5 + 0.5;
    fragColor = vec4(color * pulse, 1.0);
}
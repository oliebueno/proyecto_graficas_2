precision mediump float;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 u_lightPosition;
uniform float u_time;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Varyings
out vec3 v_normal;
out vec3 v_viewPosition;
out vec3 v_lightDirection;
out vec2 v_uv;

vec4 clipSpaceTransform(vec4 ModelPosition) {
    return projectionMatrix * viewMatrix * ModelPosition;
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = clipSpaceTransform(modelPosition);

    v_normal = normalize(mat3(modelMatrix) * normal);
    v_viewPosition = -viewPosition.xyz;
    v_lightDirection = u_lightPosition - modelPosition.xyz;
    v_uv = uv;
}

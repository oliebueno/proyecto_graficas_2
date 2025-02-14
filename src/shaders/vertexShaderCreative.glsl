precision mediump float;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_amplitude;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Varyings
out vec3 v_normal;
out vec3 v_viewPosition;
out vec2 v_uv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // baloon effect
    float inflate = sin(u_time + position.x * u_amplitude) * 0.1;
    modelPosition.xyz += normal * inflate;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    v_normal = normalize(mat3(modelMatrix) * normal);
    v_viewPosition = -viewPosition.xyz;
    v_uv = uv;
}

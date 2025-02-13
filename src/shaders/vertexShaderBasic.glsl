// vertexShaderBasic.glsl
precision mediump float;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_frequency;
uniform float u_amplitude;
uniform float u_speed;

// Attributes
in vec3 position;
in vec2 uv;

// Varyings
out vec2 v_uv;

vec4 clipSpaceTransform(vec4 ModelPosition) {
    return projectionMatrix * viewMatrix * ModelPosition;
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Gelatin movement
    modelPosition.y += sin(u_time * u_speed + position.x * u_frequency) * u_amplitude;
    modelPosition.x += cos(u_time * u_speed + position.y * u_frequency) * u_amplitude;
    modelPosition.z += sin(u_time * u_speed + position.z * u_frequency) * u_amplitude;

    gl_Position = clipSpaceTransform(modelPosition);
    v_uv = uv;
}

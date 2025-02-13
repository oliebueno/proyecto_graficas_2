precision mediump float;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;

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
    float frequency = 2.0;
    float amplitude = 0.2;
    float speed = 2.0;
    

    modelPosition.y += sin(u_time * speed + position.x * frequency) * amplitude;
    modelPosition.x += cos(u_time * speed + position.y * frequency) * amplitude;
    modelPosition.z += sin(u_time * speed + position.z * frequency) * amplitude;

    gl_Position = clipSpaceTransform(modelPosition);
    v_uv = uv;
}

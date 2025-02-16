precision mediump float;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 u_lightPosition;
uniform float u_time;
uniform float u_amplitude;
uniform float u_audioAmplitude;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Varyings
out vec3 v_normal;
out vec3 v_viewPosition;
out vec3 v_lightDirection;
out vec2 v_uv;
out vec3 v_position;

void main() {
    vec3 displacedPosition = position;
    vec4 viewPosition = viewMatrix * vec4(displacedPosition, 1.0);
    displacedPosition.y += sin(position.x * 15.0 + u_time) * u_amplitude * u_audioAmplitude;
    

    v_position = (modelMatrix * vec4(displacedPosition, 1.0)).xyz;
    v_normal = normalize(mat3(modelMatrix) * normal);
    v_viewPosition = -viewPosition.xyz;
    v_lightDirection = u_lightPosition - displacedPosition.xyz;
    v_uv = uv;

    gl_Position = projectionMatrix * viewMatrix * vec4(v_position, 1.0);
}

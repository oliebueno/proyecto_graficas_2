precision mediump float;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_amplitude; // Amplitude for vertex displacement
uniform float u_audioAmplitude; // Audio amplitude

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Varyings
out vec3 v_normal;
out vec2 v_uv;

void main() {
    vec3 displacedPosition = position;
    displacedPosition.y += sin(position.x * 10.0 + u_time) * u_amplitude * u_audioAmplitude;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(displacedPosition, 1.0);
    v_normal = normal;
    v_uv = uv;
}


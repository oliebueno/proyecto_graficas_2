import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import vertexShaderBasic from '../shaders/vertexShaderBasic.glsl';
import fragmentShaderBasic from '../shaders/fragmentShaderBasic.glsl';

class MaterialBasic {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private material: THREE.RawShaderMaterial;
  private mesh: THREE.Mesh;
  private gui: GUI;

  private cameraConfig = {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000
  }

  // Uniforms
  private uniforms: any = {
    projectionMatrix: { value: new THREE.Matrix4() },
    viewMatrix: { value: new THREE.Matrix4() },
    modelMatrix: { value: new THREE.Matrix4() },
    u_time: { value: 0.0 },
    u_frequency: { value: 3.5 },
    u_amplitude: { value: 0.1 },
    u_speed: { value: 3.0 }
  };

  constructor() {
    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      this.cameraConfig.fov,
      this.cameraConfig.aspect,
      this.cameraConfig.near,
      this.cameraConfig.far
    );
    this.camera.position.set(0, 0, 5);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });

    if (!this.renderer.capabilities.isWebGL2) {
      console.error('WebGL2 is not available on this browser');
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Create material
    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertexShaderBasic,
      fragmentShader: fragmentShaderBasic,
      uniforms: this.uniforms,
      glslVersion: THREE.GLSL3
    });

    // Create geometry and mesh
    const geometry = new THREE.SphereGeometry(1,128, 128);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    // Add event listeners
    window.addEventListener('resize', this.resize.bind(this));

    // Add GUI
    this.gui = new GUI();
    this.gui.add(this.material.uniforms.u_frequency, 'value', 0, 10).name('Frequency');
    this.gui.add(this.material.uniforms.u_amplitude, 'value', 0, 1).name('Amplitude');
    this.gui.add(this.material.uniforms.u_speed, 'value', 0, 10).name('Speed');

    // Animate function
    this.animate();
  }

  
  private resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    this.uniforms.u_time.value += 0.01;
    this.material.uniforms.projectionMatrix.value = this.camera.projectionMatrix;
    this.material.uniforms.viewMatrix.value = this.camera.matrixWorldInverse;
    this.material.uniforms.modelMatrix.value = this.mesh.matrixWorld;

    this.mesh.rotation.y = this.uniforms.u_time.value;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.gui.destroy();
    this.renderer.dispose();
  }
}

export default MaterialBasic;

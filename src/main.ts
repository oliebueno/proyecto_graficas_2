import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GUI } from 'dat.gui';

import vertexShaderBasic from './shaders/vertexShaderBasic.glsl';
import fragmentShaderBasic from './shaders/fragmentShaderBasic.glsl';


class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private time: number = 0;

  private cameraConfig = {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000
  }

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
    this.material = new THREE.RawShaderMaterial ({
      vertexShader: vertexShaderBasic,
      fragmentShader: fragmentShaderBasic,
      uniforms: {
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
        time: { value: this.time }
      },
      glslVersion: THREE.GLSL3
    });

    // Create geometry and mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    // Add resize event
    window.addEventListener('resize', this.resize.bind(this));

    // Add GUI
    const gui = new GUI();
    gui.add(this.material.uniforms.time, 'value', 0, 100).name('Time');

    // Start animation
    this.animate();
  }

  private resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    this.time += 0.01;
    this.material.uniforms.time.value = this.time;
    this.mesh.rotation.y = this.time;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

}

new App();
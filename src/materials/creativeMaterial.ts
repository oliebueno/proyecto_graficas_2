import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import { Audio, AudioListener, AudioLoader, AudioAnalyser } from 'three';

import vertexShaderCreative from '../shaders/vertexShaderCreative.glsl';
import fragmentShaderCreative from '../shaders/fragmentShaderCreative.glsl';

class MaterialCreative {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public material: THREE.RawShaderMaterial;
  public controls: OrbitControls;
  public mesh: THREE.Mesh;
  public gui: GUI;
  public analyser: AudioAnalyser;

  public cameraConfig = {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000
  }

  // Uniforms
  public uniforms: any = {
    projectionMatrix: { value: new THREE.Matrix4() },
    viewMatrix: { value: new THREE.Matrix4() },
    modelMatrix: { value: new THREE.Matrix4() },
    u_time: { value: 0.0 },
    u_materialColor: { value: new THREE.Color(0.8, 0.3, 0.3) },
    u_lightColor: { value: new THREE.Color(1, 1, 1) },
    u_amplitude: { value: 0.2 },
    u_frequency: { value: 10.0 },
    u_audioAmplitude: { value: 1.0 },
    u_audioFrequency: { value: 1.0 }
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
    this.camera.position.set(0, 0, 10); // Move camera further to fit the shape

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
      vertexShader: vertexShaderCreative,
      fragmentShader: fragmentShaderCreative,
      uniforms: this.uniforms,
      glslVersion: THREE.GLSL3
    });

    // Create geometry and mesh
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    this.mesh = new THREE.Line(geometry, this.material);
    this.scene.add(this.mesh);

    // Setup audio
    const listener = new AudioListener();
    this.camera.add(listener);

    const audio = new Audio(listener);
    const audioLoader = new AudioLoader();
    audioLoader.load('audio/song1.mp3', buffer => {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audio.play();
    });

    this.analyser = new AudioAnalyser(audio, 256);

    // Add event listeners
    window.addEventListener('resize', this.resize.bind(this));

    // Add GUI
    this.gui = new GUI();
    this.gui.addColor(this.uniforms.u_materialColor, 'value').name('Material Color').onChange(value => {
      this.uniforms.u_materialColor.value.setRGB(value.r / 255, value.g / 255, value.b / 255);
    });
    this.gui.add(this.uniforms.u_amplitude, 'value', 0.0, 1.0).name('Amplitude');
    this.gui.add(this.uniforms.u_frequency, 'value', 1.0, 20.0).name('Frequency');

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

    const data = this.analyser.getFrequencyData();
    const average = data.reduce((sum, value) => sum + value, 0) / data.length;
    this.uniforms.u_audioAmplitude.value = average / 256.0;
    this.uniforms.u_audioFrequency.value = average / 256.0;

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

export default MaterialCreative;

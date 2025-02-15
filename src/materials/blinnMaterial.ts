import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import vertexShaderBasic from '../shaders/vertexShaderBlinn.glsl';
import fragmentShaderBasic from '../shaders/fragmentShaderBlinn.glsl';

class MaterialBlinn {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public material: THREE.RawShaderMaterial;
  public controls: OrbitControls;
  public mesh: THREE.Mesh;
  public gui: GUI;

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
    u_materialColor: { value: new THREE.Color(128, 128, 128) },
    u_lightPosition: { value: new THREE.Vector3(10, 10, 10) },
    u_lightColor: { value: new THREE.Color(255, 255, 255) },
    u_specularColor: { value: new THREE.Color(255, 255, 255) },
    u_shininess: { value: 30.0 },
    u_texture: { value: null },
    u_useTexture: { value: false }

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

    // Load Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures/leather.jpg', (texture) => {
      this.uniforms.u_texture.value = texture;
    });

    // Create material
    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertexShaderBasic,
      fragmentShader: fragmentShaderBasic,
      uniforms: this.uniforms,
      glslVersion: THREE.GLSL3
    });

    // Create geometry and mesh
    const geometry = new THREE.TorusGeometry(1, 0.4, 64, 64);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    // Add event listeners
    window.addEventListener('resize', this.resize.bind(this));

    // Add GUI
    this.gui = new GUI();
    this.gui.addColor(this.material.uniforms.u_materialColor, 'value').name('Material color');
    this.gui.addColor(this.material.uniforms.u_lightColor, 'value').name('Light color');
    this.gui.addColor(this.material.uniforms.u_specularColor, 'value').name('Specular color');
    this.gui.add(this.uniforms.u_shininess, 'value', 1, 100).name('Shininess');
    this.gui.add(this.uniforms.u_useTexture, 'value').name('Use Leather Texture');
    this.gui.add

    // Animate function
    this.animate();
  }

  
  private resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
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

export default MaterialBlinn;

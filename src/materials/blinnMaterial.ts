import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import vertexShaderBlinnPhong from '../shaders/vertexShaderBlinn.glsl';
import fragmentShaderBlinnPhong from '../shaders/fragmentShaderBlinn.glsl';

class MaterialBlinnPhong {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public material: THREE.RawShaderMaterial;
  public mesh: THREE.Mesh;
  public gui: GUI;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });

    if (!this.renderer.capabilities.isWebGL2) {
      console.error('WebGL2 is not available on this browser');
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertexShaderBlinnPhong,
      fragmentShader: fragmentShaderBlinnPhong,
      uniforms: {
        u_lightPosition: { value: new THREE.Vector3(10, 10, 10) },
        u_lightColor: { value: new THREE.Color(1, 1, 1) },
        u_materialColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
        u_specularColor: { value: new THREE.Color(1, 1, 1) },
        u_shininess: { value: 30.0 },
        u_time: { value: 0.0 }
      },
      glslVersion: THREE.GLSL3
    });

    const geometry = new THREE.SphereGeometry(1, 128, 128);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    window.addEventListener('resize', this.resize.bind(this));

    this.gui = new GUI();
    this.gui.addColor(this.material.uniforms.u_lightColor, 'value').name('Light Color');
    this.gui.addColor(this.material.uniforms.u_materialColor, 'value').name('Material Color');
    this.gui.addColor(this.material.uniforms.u_specularColor, 'value').name('Specular Color');
    this.gui.add(this.material.uniforms.u_shininess, 'value', 1, 100).name('Shininess');

    this.animate();
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.gui.destroy();
    this.renderer.dispose();
  }

  private resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.material.uniforms.u_time.value += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

export default MaterialBlinnPhong;

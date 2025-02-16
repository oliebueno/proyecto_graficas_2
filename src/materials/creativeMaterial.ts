import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

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
    public analyser: THREE.AudioAnalyser;
    public audio: THREE.Audio;
    public listener: THREE.AudioListener;
    public audioLoader: THREE.AudioLoader;

    // Songs
    public songs: string[] = ['audio/song1.mp3', 'audio/song2.mp3', 'audio/song3.mp3'];
    public currentSongIndex: number = 0;

    public cameraConfig = {
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000
    };

    // Uniforms
    public uniforms: any = {
        projectionMatrix: { value: new THREE.Matrix4() },
        viewMatrix: { value: new THREE.Matrix4() },
        modelMatrix: { value: new THREE.Matrix4() },
        u_time: { value: 0.0 },
        u_materialColor: { value: new THREE.Color(133, 0, 255) },
        u_lightPosition: { value: new THREE.Vector3(10, 10, 10) },
        u_lightColor: { value: new THREE.Color(255, 255, 255) },
        u_specularColor: { value: new THREE.Color(255, 255, 255) },
        u_shininess: { value: 5.0 },
        u_cameraPosition: { value: new THREE.Vector3() },
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
        this.camera.position.set(0, 2, 5);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });

        if (!this.renderer.capabilities.isWebGL2) {
            console.error('WebGL2 is not available on this browser');
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('scene-container')?.appendChild(this.renderer.domElement);

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
        const geometry = new THREE.BoxGeometry(20, 1, 1, 1024, 1024, 1024);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Create analizer audio
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        this.audio = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.loadSong(this.songs[this.currentSongIndex]);

        this.analyser = new THREE.AudioAnalyser(this.audio, 256);

        // Music controls
        window.addEventListener('resize', this.resize.bind(this));
        document.getElementById('play')?.addEventListener('click', () => this.playAudio());
        document.getElementById('pause')?.addEventListener('click', () => this.pauseAudio());
        document.getElementById('song1')?.addEventListener('click', () => this.changeSong(0));
        document.getElementById('song2')?.addEventListener('click', () => this.changeSong(1));
        document.getElementById('song3')?.addEventListener('click', () => this.changeSong(2));

        // Add GUI
        this.gui = new GUI();
        this.gui.addColor(this.material.uniforms.u_materialColor, 'value').name('Material color');
        this.gui.addColor(this.material.uniforms.u_lightColor, 'value').name('Light color');
        this.gui.addColor(this.material.uniforms.u_specularColor, 'value').name('Specular color');
        this.gui.add(this.uniforms.u_shininess, 'value', 1, 30).name('Shininess');
        this.gui.add(this.uniforms.u_amplitude, 'value', 0.0, 1.0).name('Amplitude');
        this.gui.add(this.uniforms.u_frequency, 'value', 1.0, 20.0).name('Intensity');

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
        this.uniforms.u_cameraPosition.value.copy(this.camera.position);

        const data = this.analyser.getFrequencyData();
        const average = data.reduce((sum, value) => sum + value, 0) / data.length;
        this.uniforms.u_audioAmplitude.value = average / 256.0;
        this.uniforms.u_audioFrequency.value = average / 256.0;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    private loadSong(songPath: string) {
        this.audioLoader.load(songPath, buffer => {
            this.audio.setBuffer(buffer);
            this.audio.play();
        });
    }

    private changeSong(index: number) {
        if (this.currentSongIndex === index) {
            this.audio.stop();
            this.audio.play();
        } else {
            this.currentSongIndex = index;
            this.audio.stop();
            this.loadSong(this.songs[index]);
        }
    }

    private playAudio() {
        if (!this.audio.isPlaying) {
            this.audio.play();
        }
    }

    private pauseAudio() {
        this.audio.pause();
    }

    public stopAudio() {
        this.audio.stop();
    }
    

    public dispose() {
      this.stopAudio();
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.gui.destroy();
      this.renderer.dispose();
  }
}

export default MaterialCreative;


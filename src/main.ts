import MaterialBasic from './materials/basicMaterial';
import MaterialBlinnPhong from './materials/blinnMaterial';
import MaterialCreative from './materials/creativeMaterial';

class MainApp {
    private materials = [MaterialBasic, MaterialBlinnPhong, MaterialCreative];
    private currentMaterial: any;
    private currentContainer: HTMLElement | null;
    private audioControls: HTMLElement | null;

    constructor() {
        this.currentContainer = document.getElementById('scene-container');
        this.audioControls = document.getElementById('audio-controls');
        this.setupUI();
        this.changeMaterial(0);
    }

    private setupUI() {
        const button1 = document.getElementById('material1');
        const button2 = document.getElementById('material2');
        const button3 = document.getElementById('material3');

        button1?.addEventListener('click', () => this.changeMaterial(0));
        button2?.addEventListener('click', () => this.changeMaterial(1));
        button3?.addEventListener('click', () => this.changeMaterial(2));
    }

    private changeMaterial(index: number) {
        if (this.currentMaterial) {
            this.disposeCurrentMaterial();
        }

        this.currentMaterial = new this.materials[index]();
        if (this.currentContainer) {
            this.currentContainer.appendChild(this.currentMaterial.renderer.domElement);
        }

        if (index === 2) {
            this.audioControls!.style.display = 'flex';
        } else {
            this.audioControls!.style.display = 'none';
        }
    }

    private disposeCurrentMaterial() {
        if (this.currentMaterial) {
            if (this.currentMaterial instanceof MaterialCreative) {
                this.currentMaterial.stopAudio();
            }

            if (this.currentContainer && this.currentMaterial.renderer.domElement) {
                this.currentContainer.removeChild(this.currentMaterial.renderer.domElement);
            }

            if (this.currentMaterial.mesh) {
                this.currentMaterial.scene.remove(this.currentMaterial.mesh);
                this.currentMaterial.mesh.geometry.dispose();
                this.currentMaterial.mesh.material.dispose();
            }

            if (this.currentMaterial.gui) {
                this.currentMaterial.gui.destroy();
            }

            if (this.currentMaterial.renderer) {
                this.currentMaterial.renderer.dispose();
            }
        }
    }
}

new MainApp();

import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

export default class SceneManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;

    constructor(timeSeriesPlayer: HTMLDivElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, timeSeriesPlayer.offsetWidth / timeSeriesPlayer.offsetHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer();
        this.labelRenderer = new CSS2DRenderer();

        this.setupRenderers(timeSeriesPlayer);
        timeSeriesPlayer.appendChild(this.renderer.domElement);
        timeSeriesPlayer.appendChild(this.labelRenderer.domElement);
    }

    private setupRenderers(timeSeriesPlayer: HTMLDivElement) {
        this.renderer.setSize(timeSeriesPlayer.offsetWidth, timeSeriesPlayer.offsetHeight);
        this.labelRenderer.setSize(timeSeriesPlayer.offsetWidth, timeSeriesPlayer.offsetHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
    }

    render() {
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }

    getScene() {
        return this.scene;
    }
}
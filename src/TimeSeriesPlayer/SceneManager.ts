import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

export default class SceneManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    raycaster: THREE.Raycaster;

    constructor(timeSeriesPlayer: HTMLDivElement) {
        this.scene = this.createScene();
        this.camera = this.createCamera(timeSeriesPlayer);
        this.renderer = this.createRenderer(timeSeriesPlayer);
        this.labelRenderer = this.createLabelRenderer(timeSeriesPlayer);
        this.raycaster = this.createRaycaster(this.camera);

        // this.createDebugDot();
    }

    private createScene() {
        return new THREE.Scene();
    }

    private createCamera(timeSeriesPlayer: HTMLDivElement) {
        const camera = new THREE.PerspectiveCamera(75, timeSeriesPlayer.offsetWidth / timeSeriesPlayer.offsetHeight, 0.1, 1000);
        camera.name = 'camera';
        camera.position.setZ(5);
        camera.lookAt(0, 0, 0);
        return camera
    }

    private createRenderer(timeSeriesPlayer: HTMLDivElement) {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(timeSeriesPlayer.offsetWidth, timeSeriesPlayer.offsetHeight);
        timeSeriesPlayer.appendChild(renderer.domElement);
        return renderer;
    }

    private createLabelRenderer(timeSeriesPlayer: HTMLDivElement) {
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(timeSeriesPlayer.offsetWidth, timeSeriesPlayer.offsetHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        timeSeriesPlayer.appendChild(labelRenderer.domElement);
        return labelRenderer;
    }

    private createRaycaster(camera: THREE.PerspectiveCamera) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        return raycaster;
    }

    // private createDebugDot() {
    //     const geometry = new THREE.SphereGeometry(0.1);
    //     const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //     const mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.set(0, 0.2, 0);
    //     this.scene.add(mesh);
    // }

    render() {
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }

    getCenterIntersects() {
        return this.raycaster.intersectObjects(this.scene.children);
    }

    getScene() {
        return this.scene;
    }
}
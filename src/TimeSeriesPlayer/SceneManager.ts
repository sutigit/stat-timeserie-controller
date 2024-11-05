import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import Data from './Data';

export default class SceneManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    centerRaycaster: THREE.Raycaster;
    pointerRaycaster: THREE.Raycaster;

    constructor(Data: Data) {
        this.scene = this.createScene();
        this.camera = this.createCamera(Data);
        this.renderer = this.createRenderer(Data);
        this.labelRenderer = this.createLabelRenderer(Data);
        this.centerRaycaster = new THREE.Raycaster();
        this.pointerRaycaster = new THREE.Raycaster();
    }

    private createScene() {
        return new THREE.Scene();
    }

    private createCamera(Data: Data) {
        const camera = new THREE.PerspectiveCamera(75, Data.getData('elementWidth') / Data.getData('elementHeight'), 0.1, 1000);
        camera.name = 'camera';
        camera.position.setZ(5);
        camera.lookAt(0, 0, 0);
        return camera
    }

    private createRenderer(Data: Data) {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(Data.getData('elementWidth'), Data.getData('elementHeight'));
        Data.getData('element').appendChild(renderer.domElement);
        return renderer;
    }

    private createLabelRenderer(Data: Data) {
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(Data.getData('elementWidth'), Data.getData('elementHeight'));
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        Data.getData('element').appendChild(labelRenderer.domElement);
        return labelRenderer;
    }

    getPointerIntersects(pointer: THREE.Vector2) {
        this.pointerRaycaster.setFromCamera(pointer, this.camera);
        return this.pointerRaycaster.intersectObjects(this.scene.children);
    }

    getCenterIntersects() {
        this.centerRaycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        return this.centerRaycaster.intersectObjects(this.scene.children);
    }

    getScene() {
        return this.scene;
    }

    render() {
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }
}
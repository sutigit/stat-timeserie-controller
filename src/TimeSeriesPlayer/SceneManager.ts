import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import STICRead from './STICRead';

export default class SceneManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    centerRaycaster: THREE.Raycaster;
    pointerRaycaster: THREE.Raycaster;

    constructor(STICRead: STICRead) {
        this.scene = this.createScene();
        this.camera = this.createCamera(STICRead);
        this.renderer = this.createRenderer(STICRead);
        this.labelRenderer = this.createLabelRenderer(STICRead);
        this.centerRaycaster = new THREE.Raycaster();
        this.pointerRaycaster = new THREE.Raycaster();
    }

    private createScene() {
        return new THREE.Scene();
    }

    private createCamera(STICRead: STICRead) {
        const camera = new THREE.PerspectiveCamera(75, STICRead.getData('containerWidth') / STICRead.getData('containerHeight'), 0.1, 1000);
        camera.name = 'camera';
        camera.position.setZ(5);
        camera.lookAt(0, 0, 0);
        return camera
    }

    private createRenderer(STICRead: STICRead) {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(STICRead.getData('containerWidth'), STICRead.getData('containerHeight'));
        STICRead.getData('container').appendChild(renderer.domElement);
        return renderer;
    }

    private createLabelRenderer(STICRead: STICRead) {
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(STICRead.getData('containerWidth'), STICRead.getData('containerHeight'));
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        STICRead.getData('container').appendChild(labelRenderer.domElement);
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
import * as THREE from 'three';

export default class SeekBar {
    rectWidth: number;
    rectHeight: number;
    gap: number;
    numYears: number;
    scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.rectWidth = 2;
        this.rectHeight = 0.6;
        this.gap = this.rectWidth / 8;
        this.numYears = 2100 - 1800;
        this.scene = scene;

        this.createSeekBar();
        this.createCenterTick();
    }

    createSeekBar() {
        const geometry = new THREE.PlaneGeometry(this.rectWidth, this.rectHeight);
        const material = new THREE.MeshBasicMaterial({ color: 0x5f5d61, side: THREE.DoubleSide });

        for (let i = -this.numYears / 2; i < this.numYears / 2; i++) {
            const square = new THREE.Mesh(geometry, material);
            square.position.set(i * (this.rectWidth + this.gap) + (this.rectWidth / 2), 0.2, 0);
            this.scene.add(square);
        }
    }

    createCenterTick() {
        const centerGeom = new THREE.PlaneGeometry(0.15, 1);
        const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

        const tick = new THREE.Mesh(centerGeom, centerMat);
        tick.position.set(0, 0.2, 0);
        this.scene.add(tick);
    }
}
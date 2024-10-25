import * as THREE from 'three';
import SceneManager from './SceneManager';

export default class SeekBar {
    rectWidth: number;
    rectHeight: number;
    gap: number;
    yearCellWidth: number;
    numYears: number;
    sceneManager: SceneManager;
    scene: THREE.Scene;
    squares: THREE.Mesh[]; // Store all squares in seek bar
    isAnimating: boolean;

    constructor(sceneManager: SceneManager) {
        this.rectWidth = 2;
        this.rectHeight = 0.6;
        this.gap = this.rectWidth / 8;
        this.yearCellWidth = this.rectWidth + this.gap;
        this.numYears = 2050 - 1950;
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.squares = [];
        this.isAnimating = false;

        this.createSeekBar();
        this.createCenterTick();
    }

    private createSeekBar() {
        const geometry = new THREE.PlaneGeometry(this.rectWidth, this.rectHeight);
        const material = new THREE.MeshBasicMaterial({ color: 0x5f5d61 });

        for (let i = -this.numYears / 2; i < this.numYears / 2; i++) {
            const square = new THREE.Mesh(geometry, material);
            square.position.set(i * (this.rectWidth + this.gap) + (this.rectWidth / 2), 0.2, 0);
            this.squares.push(square);
            this.scene.add(square);
        }
    }

    private createCenterTick() {
        const centerGeom = new THREE.PlaneGeometry(0.15, 1);
        const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const tick = new THREE.Mesh(centerGeom, centerMat);
        tick.position.set(0, 0.2, 0);
        this.scene.add(tick);
    }

    moveBy(distance: number) {
        this.squares.forEach((square) => {
            // Animate the squares by incrementally changing their x position
            square.position.x -= distance;
        });
    }

    moveTo(distance: number) {
        this.squares.forEach((square, i) => {
            const inc = i - this.numYears / 2;
            square.position.setX(inc * (this.rectWidth + this.gap) + (this.rectWidth / 2) - distance);
        });
    }

    getYearCellWidth() {
        return this.yearCellWidth;
    }
}
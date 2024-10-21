import * as THREE from 'three';
import SceneManager from './SceneManager';

export default class SeekBar {
    rectWidth: number;
    rectHeight: number;
    gap: number;
    numYears: number;
    sceneManager: SceneManager;
    scene: THREE.Scene;
    squares: THREE.Mesh[]; // Store all squares in seek bar
    isAnimating: boolean;

    constructor(sceneManager: SceneManager) {
        this.rectWidth = 2;
        this.rectHeight = 0.6;
        this.gap = this.rectWidth / 8;
        this.numYears = 2050 - 1950;
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.squares = [];
        this.isAnimating = false;

        this.createSeekBar();
        this.createCenterTick();
    }

    createSeekBar() {
        const geometry = new THREE.PlaneGeometry(this.rectWidth, this.rectHeight);
        const material = new THREE.MeshBasicMaterial({ color: 0x5f5d61 });

        for (let i = -this.numYears / 2; i < this.numYears / 2; i++) {
            const square = new THREE.Mesh(geometry, material);
            square.position.set(i * (this.rectWidth + this.gap) + (this.rectWidth / 2), 0.2, 0);
            this.squares.push(square);
            this.scene.add(square);
        }
    }

    createCenterTick() {
        const centerGeom = new THREE.PlaneGeometry(0.15, 1);
        const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const tick = new THREE.Mesh(centerGeom, centerMat);
        tick.position.set(0, 0.2, 0);
        this.scene.add(tick);
    }

    animateSquares() {
        if (this.isAnimating) return;  // Prevent starting multiple animations
        this.isAnimating = true;
        
        const duration = 20; // seconds
        const distance = 0.01; // distance to move squares

        const startTime = performance.now();

        const animate = (time: number) => {
            const elapsedTime = (time - startTime) / 1000;
            const progress = Math.min(elapsedTime / duration, 1);  // Normalize to [0, 1]
            
            this.squares.forEach((square) => {
                // Animate the squares by changing their x position
                square.position.x -= distance
            });

            this.sceneManager.render(); // Render the scene after updating square positions
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false; // Reset animation state after completion
            }
        };

        requestAnimationFrame(animate);
    }
}
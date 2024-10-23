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

    startAnimation() {
        if (this.isAnimating) return;  // Prevent starting multiple animations
        this.isAnimating = true;
        
        const yearDuration = 1000; // 2 seconds
        const yearDistance = this.rectWidth + this.gap; // distance to move squares

        let last = performance.now(); // Use performance.now() for precise timing
        let timeProgress = 0;

        const animate = (currentTime: number) => {
            if (!this.isAnimating) return;  // Stop animation if user clicks pause button

            const tickTime = currentTime - last;
            const tickDistance = (tickTime / yearDuration) * yearDistance;
            
            this.squares.forEach((square) => {
                // Animate the squares by changing their x position
                square.position.x -= tickDistance;
            });

            timeProgress += tickTime
            last = currentTime;

            this.sceneManager.render(); // Render the scene after updating square positions
            
            // Determine if animation should continue
            if (timeProgress <= yearDuration) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false; // Reset animation state after completion
            }
        };

        requestAnimationFrame(animate);
    }

    stopAnimation() {
        this.isAnimating = false;
    }
}
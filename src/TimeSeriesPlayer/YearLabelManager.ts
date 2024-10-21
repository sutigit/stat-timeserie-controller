import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export default class YearLabelManager {
    scene: THREE.Scene;
    numYears: number;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.numYears = 2100 - 1800;

        this.addYearLabels();
    }

    addYearLabels() {
        for (let i = -this.numYears / 2; i < this.numYears / 2; i++) {
            const year = document.createElement('div');
            const yearNum = 1987 + i;

            year.style.color = '#ffffff';
            year.style.fontFamily = 'Monospace';
            year.style.fontWeight = 'bold';
            year.style.fontSize = '12px';
            year.textContent = yearNum.toString();
            // transition: font-size 0.5s ease; /* Adjust the time and easing */
            year.style.transition = 'font-size 0.1s ease';
            year.style.willChange = 'font-size'; // Optimize for animation

            if (yearNum === 1987) {
                setTimeout(() => {
                    year.style.fontSize = '24px';  // Change the font size after rendering
                }, 1000); // Small delay to ensure transition is visible
            }

            const label = new CSS2DObject(year);
            label.position.set(i * 4, 2, 0);
            this.scene.add(label);
        }
    }
}
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SceneManager from './SceneManager';

export default class YearLabelManager {
    sceneManager: SceneManager;
    scene: THREE.Scene;
    numYears: number;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.numYears = 2050 - 1950;

        this.createYearLabels();
    }

    private createYearLabels() {
        for (let i = -this.numYears / 2; i < this.numYears / 2; i++) {
            const year = document.createElement('div');
            const yearNum = 2000 + i;

            year.style.color = '#ffffff';
            year.style.fontFamily = 'Sans-Serif';
            year.style.fontWeight = 'bold';
            year.style.fontSize = '12px';
            year.textContent = yearNum.toString();
            // transition: font-size 0.5s ease; /* Adjust the time and easing */
            year.style.transition = 'font-size 0.1s ease';
            year.style.willChange = 'font-size'; // Optimize for animation

            if (yearNum === 2000) {
                // setTimeout(() => {
                //     year.style.fontSize = '24px';  // Change the font size after rendering
                // }, 1000); // Small delay to ensure transition is visible

                year.style.fontSize = '24px';  // Change the font size after rendering
            }

            const label = new CSS2DObject(year);
            label.position.set(i * 4, 2, 0);
            label.name = `label_${yearNum.toString()}`;
            this.scene.add(label);
        }
    }
}
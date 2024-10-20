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

            if (yearNum === 1987) {
                year.style.fontSize = '24px';
            }

            const label = new CSS2DObject(year);
            label.position.set(i * 4, 2, 0);
            this.scene.add(label);
        }
    }
}
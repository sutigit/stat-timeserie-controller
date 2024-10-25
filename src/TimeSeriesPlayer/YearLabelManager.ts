import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SceneManager from './SceneManager';
import STICRead from './STICRead';

export default class YearLabelManager {
    // Dependent classes
    sceneManager: SceneManager;
    scene: THREE.Scene;

    // Time properties
    minYear: number;
    maxYear: number;
    numOfYears: number;

    // Geometry properties
    gap: number;
    labelOffsetY: number;

    // Year management
    currentYear: number;

    // Meshes
    yearLabels: CSS2DObject[]; // Store all year labels

    constructor(sceneManager: SceneManager, STICRead: STICRead) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.minYear = STICRead.getData('minYear');
        this.maxYear = STICRead.getData('maxYear');
        this.numOfYears = STICRead.getData('numOfYears');

        this.gap = 4;
        this.labelOffsetY = 2;

        this.currentYear = STICRead.getData('currentYear');

        this.yearLabels = [];

        this.createYearLabels();
    }

    private createYearLabels() {

        // Inactive leading year labels: years before minYear
        for (let i = -40; i < 0; i++) {
            this.createYearLabel(this.minYear + i, i);
        }

        // Active year labels: years between minYear and maxYear
        for (let i = 0; i < this.numOfYears; i++) {
            this.createYearLabel(this.minYear + i, i);
        }

        // Inactive trailing year labels: years after maxYear
        for (let i = this.numOfYears; i < this.numOfYears + 40; i++) {
            this.createYearLabel(this.minYear + i, i);
        }
    }

    private createYearLabel(year: number, position: number) {
        const div = document.createElement('div');

        div.style.color = '#ffffff';
        div.style.fontFamily = 'Sans-Serif';
        div.style.fontWeight = 'bold';
        div.style.fontSize = '12px';
        div.textContent = year.toString();
        div.style.transition = 'font-size 0.1s ease';
        div.style.willChange = 'font-size'; // Optimize for animation

        const label = new CSS2DObject(div);
        label.position.set(position * this.gap, this.labelOffsetY, 0);
        label.name = `label_${year.toString()}`;
        
        this.yearLabels.push(label);
        this.scene.add(label);
    }

    changeYearTo(currentYear: number) {
        this.currentYear = currentYear;
    }

    getCurrentYear() {
        return this.currentYear;
    }
}
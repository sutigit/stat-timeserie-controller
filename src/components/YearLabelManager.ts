import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SceneManager from './SceneManager';
import Data from './Data';

// Utils
import { easeOutQuad } from '../utils';

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
    maxFontSize: number;
    minFontSize: number;

    // Meshes
    yearLabels: CSS2DObject[]; // Store all year labels

    // Year management
    currentYear: number;
    currentYearObject: CSS2DObject | undefined;
    prevYearObject: CSS2DObject | undefined;

    // Animation properties
    animationId: number;
    animationMoveTime: number;
    animationScaleTime: number;
    lastTime: number;

    constructor(sceneManager: SceneManager, Data: Data) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.minYear = Data.get('minYear');
        this.maxYear = Data.get('maxYear');
        this.numOfYears = Data.get('numOfYears');

        this.gap = 4;
        this.labelOffsetY = 2;
        this.minFontSize = 12;
        this.maxFontSize = 20;
        
        this.yearLabels = [];
        this.createYearLabels();
        
        this.currentYear = Data.get('currentYear');
        this.currentYearObject = this.getYearLabelObject(this.currentYear);
        this.prevYearObject = undefined;

        this.animationId = 0;
        this.animationMoveTime = 1000; // ms
        this.animationScaleTime = 160; // ms
        this.lastTime = 0;

        this.scaleLabel(this.currentYearObject, 1);
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
        div.style.fontFamily = 'monospace';
        div.style.fontWeight = 'bold';
        div.style.fontSize = `${this.minFontSize}px`;
        div.style.textAlign = 'center';
        div.style.willChange = 'font-size';
        div.textContent = year.toString();

        const label = new CSS2DObject(div);
        label.position.set(position * this.gap, this.labelOffsetY, 0);
        label.name = `label_${year.toString()}`;

        // make label undetectable by raycaster
        label.raycast = () => {};

        this.yearLabels.push(label);
        this.scene.add(label);
    }

    private animateTo(year: number) {
        const targetYear = this.getYearLabelObject(year);
        if (!targetYear) return;

        // Get distance from center for calculation
        const distanceFromCenter = targetYear.position.x;

        // Get the time of start of this animation
        this.lastTime = performance.now();

        // Recursively call animation
        this.animationId = requestAnimationFrame((requestTime) => this.animation(requestTime, distanceFromCenter));
    }

    private animation(currentTime: number, startDistance: number) {
        // Calculate elapsed time since animation start
        const elapsedTime = currentTime - this.lastTime;

        // Normalized progress of the animations (between 0 and 1)
        const moveProgress = Math.min(elapsedTime / this.animationMoveTime, 1);
        const scaleProgress = Math.min(elapsedTime / this.animationScaleTime, 1);

        // Stop if animation is complete
        if (moveProgress == 1 && scaleProgress == 1) {
            cancelAnimationFrame(this.animationId);
            return;
        }

        // Eased progress for decelerated movement
        const easedMoveProgress = easeOutQuad(moveProgress);
        const easedScaleProgress = easeOutQuad(scaleProgress);

        // Calculate distance to move in this frame
        const distanceToMove = startDistance * easedMoveProgress;

        // Apply the movement to the labels
        this.moveLabels(distanceToMove);

        // Grow the target year label when distance shrinks
        this.scaleLabel(this.currentYearObject, easedScaleProgress);

        // Shrink the previous year label when distance grows
        this.scaleLabel(this.prevYearObject, 1 - easedScaleProgress);

        // Request next frame and pass remaining distance
        this.animationId = requestAnimationFrame((requestTime) =>
            this.animation(requestTime, startDistance * (1 - easedMoveProgress))
        );
    }

    private moveLabels(distance: number) {
        this.yearLabels.forEach(label => {
            label.position.x -= distance;
        });
    }

    private scaleLabel(yearObject: CSS2DObject | undefined | null, progress: number) {
        if (!yearObject) return;
        
        const fontSize = this.minFontSize + (this.maxFontSize - this.minFontSize) * progress;
        yearObject.element.style.fontSize = `${fontSize}px`;
    }

    private getYearLabelObject(year: number) {
        return this.yearLabels.find(label => parseInt(label.name.split('_')[1]) === year);
    }

    setCurrentYear(year: number) {
        this.currentYear = year;
        this.prevYearObject = this.currentYearObject;
        this.currentYearObject = this.getYearLabelObject(year);

        this.animateTo(year);
    }

    getCurrentYear() {
        return this.currentYear;
    }
}
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SceneManager from './SceneManager';
import SeekBar from './SeekBar';
import YearLabelManager from './YearLabelManager';
import STICRead from './STICRead';

export default class PlayButton {
    // Dependent classes
    sceneManager: SceneManager;
    scene: THREE.Scene;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager
    STICRead: STICRead;
    
    // HTML elements
    playPauseButton: HTMLImageElement;
    
    // Animation properties
    isPlaying: boolean;
    animationId: number;

    // Animation timing properties
    timePerYear: number;
    distancePerYear: number;

    // Year management
    currentYear: number;

    constructor(sceneManager: SceneManager, seekBar: SeekBar, yearLabelManager: YearLabelManager, STICRead: STICRead) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.seekBar = seekBar;
        this.yearLabelManager = yearLabelManager;
        this.STICRead = STICRead;

        this.playPauseButton = this.createPlayPauseButton();
        
        this.isPlaying = false;
        this.animationId = 0;

        this.timePerYear = 2000;
        this.distancePerYear = this.seekBar.getDistancePerYear();

        this.currentYear = STICRead.getData('currentYear');
    }

    private createPlayPauseButton() {
        const playPauseImg = document.createElement('img');
        playPauseImg.src = 'src/play.svg';
        playPauseImg.style.width = '38px';
        playPauseImg.style.height = '38px';
        playPauseImg.style.cursor = 'pointer';

        playPauseImg.addEventListener('click', () => this.togglePlayPause());

        const playPauseButton = new CSS2DObject(playPauseImg);
        playPauseButton.position.set(0, -2, 0);
        this.scene.add(playPauseButton);
        return playPauseImg;
    }

    private togglePlayPause() {
        this.isPlaying ? this.stopAnimation() : this.startAnimation();
        this.isPlaying = !this.isPlaying;
    }

    private animation(currentTime: number, lastTime: number) {

        // Move seek bar per frame
        this.animateSeekBars(currentTime, lastTime);

        // Inspect current cell and update current year if cell changes  
        this.updateCurrentYear(this.seekBar.getCurrentCell());

        // Call next frame
        this.animationId = requestAnimationFrame((requestTime) => this.animation(requestTime, currentTime));
    }

    private startAnimation() {
        this.playPauseButton.src = 'src/pause.svg';
        this.animationId = requestAnimationFrame((requestTime) => this.animation(requestTime, performance.now()));
    }

    private stopAnimation() {
        this.playPauseButton.src = 'src/play.svg';
        cancelAnimationFrame(this.animationId);
    }

    private animateSeekBars(currentTime: number, lastTime: number) {
        const elapsedTime = currentTime - lastTime;
        const distance = (elapsedTime / this.timePerYear) * this.distancePerYear;
        this.seekBar.move(distance);
    }

    private updateCurrentYear(inspectedCell: THREE.Intersection | null) {
        if (inspectedCell) {
            const inspectedCellYear = parseInt(inspectedCell.object.name.split('_')[1]);
            if (inspectedCellYear !== this.currentYear) {
                this.currentYear = inspectedCellYear;
            }
        }
    }
}

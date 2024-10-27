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

    // Animation properties
    isPlaying: boolean;
    animationId: number;

    // Animation timing properties
    speed: number;
    distance: number;

    // HTML elements
    playPauseButton: HTMLImageElement;

    constructor(sceneManager: SceneManager, seekBar: SeekBar, yearLabelManager: YearLabelManager, STICRead: STICRead) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.seekBar = seekBar;
        this.yearLabelManager = yearLabelManager;

        this.isPlaying = false;
        this.animationId = 0;

        this.speed = 2000; // Speed represents: milliseconds per year cell
        this.distance = this.seekBar.getDistancePerYear(); // Distance represents: width of a year cell

        this.playPauseButton = this.createPlayPauseButton();
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

        // Make button undetectable by raycaster
        playPauseButton.raycast = () => {};

        this.scene.add(playPauseButton);
        return playPauseImg;
    }

    private togglePlayPause() {
        this.isPlaying ? this.stopAnimation() : this.startAnimation();
        this.isPlaying = !this.isPlaying;
    }

    private startAnimation() {
        this.playPauseButton.src = 'src/pause.svg';
        this.animationId = requestAnimationFrame((requestTime) => this.animations(requestTime, performance.now()));
    }

    private stopAnimation() {
        this.playPauseButton.src = 'src/play.svg';
        cancelAnimationFrame(this.animationId);
    }

    private animations(currentTime: number, lastTime: number) {

        // Move seek bar per frame
        this.seekBarsAnimation(currentTime, lastTime);

        // Inspect current cell and update current year if cell changes  
        this.yearLabelsAnimation(this.seekBar);

        // Important: re-render the scene only here
        this.sceneManager.render();

        // Call next frame
        this.animationId = requestAnimationFrame((requestTime) => this.animations(requestTime, currentTime));
    }

    private seekBarsAnimation(currentTime: number, lastTime: number) {
        const elapsedTime = currentTime - lastTime;
        const distancePerFrame = (elapsedTime / this.speed) * this.distance;
        this.seekBar.move(distancePerFrame);
    }

    private yearLabelsAnimation(seekBar: SeekBar) {
        // This function is called every frame but only 
        // updates the year label if the current cell changes

        const currentCell = seekBar.getCurrentCell();

        if (currentCell) {
            const currentCellYear = parseInt(currentCell.object.name.split('_')[1]);

            if (currentCellYear !== this.yearLabelManager.getCurrentYear()) {
                this.yearLabelManager.setCurrentYear(currentCellYear);
            }
        }
    }
}

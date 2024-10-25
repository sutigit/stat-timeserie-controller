import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SceneManager from './SceneManager';
import SeekBar from './SeekBar';
import YearLabelManager from './YearLabelManager';
import STICRead from './STICRead';

export default class PlayButton {
    sceneManager: SceneManager;
    scene: THREE.Scene;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager
    STICRead: STICRead;
    isPlaying: boolean;

    constructor(sceneManager: SceneManager, seekBar: SeekBar, yearLabelManager: YearLabelManager, STICRead: STICRead) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.seekBar = seekBar;
        this.yearLabelManager = yearLabelManager;
        this.STICRead = STICRead;
        this.isPlaying = false;

        this.createPlayButton();
    }

    private createPlayButton() {
        const playPauseImg = document.createElement('img');
        playPauseImg.src = 'src/play.svg';
        playPauseImg.style.width = '38px';
        playPauseImg.style.height = '38px';
        playPauseImg.style.cursor = 'pointer';

        playPauseImg.addEventListener('click', () => this.togglePlayPause(playPauseImg));

        const playPauseButton = new CSS2DObject(playPauseImg);
        playPauseButton.position.set(0, -2, 0);
        this.scene.add(playPauseButton);
    }

    private togglePlayPause(playPauseImg: HTMLImageElement) {
        if (this.isPlaying) {
            // Stop animation and display play icon
            this.stopSeekBar();
            playPauseImg.src = 'src/play.svg';
        } else {
            // Start animation and display pause icon
            this.playSeekBar();
            playPauseImg.src = 'src/pause.svg';
        }

        // Toggle play/pause state
        this.isPlaying = !this.isPlaying;
    }

    playSeekBar() {
        const yearsToTravel = 10;
        let yearsTraveled = 0;

        const timePerYear = 2000; // 2 seconds
        const distancePerYear = this.seekBar.getYearCellWidth(); // distance to move squares

        let timeProgress = 0;
        let distanceProgress = 0;
        let overallTimeProgress = 0;
        let overallDistanceProgress = 0;

        // Use performance.now() for precise timing
        let lastTime = performance.now();


        const animate = (currentTime: number) => {

            // Stops render recursion if user clicks pause button
            console.log(this.isPlaying);
            if (!this.isPlaying) return;

            // Re-render scene per frame
            this.sceneManager.render();

            // Calculate changes to be made per frame
            const timePerFrame = currentTime - lastTime;
            const distancePerFrame = (timePerFrame / timePerYear) * distancePerYear;
            lastTime = currentTime;


            // Update progresses per frame
            timeProgress += timePerFrame
            overallTimeProgress += timePerFrame;

            distanceProgress += distancePerFrame;
            overallDistanceProgress += distancePerFrame;





            if (timeProgress < timePerYear && distanceProgress < distancePerYear) {

                this.seekBar.moveBy(distancePerFrame);

                requestAnimationFrame(animate);

            } 

            else if ( overallTimeProgress < timePerYear * yearsToTravel && overallDistanceProgress < distancePerYear * yearsToTravel ) {
                yearsTraveled++;

                // Reset time and distance progress after each year
                timeProgress = 0;
                distanceProgress = 0;

                // Move squares by distancePerYear
                this.seekBar.moveTo(distancePerYear * yearsTraveled);

                requestAnimationFrame(animate);
            }

            else {
                this.isPlaying = false; // Reset animation state after completion
            }
        };

        requestAnimationFrame(animate);
    }

    stopSeekBar() {
        this.isPlaying = false;
    }
}

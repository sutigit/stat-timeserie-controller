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
            playPauseImg.src = 'src/play.svg';
            this.seekBar.stopAnimation();
        } else {
            playPauseImg.src = 'src/pause.svg';
            this.seekBar.startAnimation();
        }
        this.isPlaying = !this.isPlaying;
    }
}

import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export default class PlayButton {
    scene: THREE.Scene;
    isPlaying: boolean;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.isPlaying = false;
        this.createButton();
    }

    createButton() {
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

    togglePlayPause(playPauseImg: HTMLImageElement) {
        if (this.isPlaying) {
            playPauseImg.src = 'src/play.svg';
        } else {
            playPauseImg.src = 'src/pause.svg';
        }
        this.isPlaying = !this.isPlaying;
    }
}

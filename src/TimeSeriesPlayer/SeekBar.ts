import * as THREE from 'three';
import SceneManager from './SceneManager';
import STICRead from './STICRead';

export default class SeekBar {
    // Dependent classes
    sceneManager: SceneManager;
    scene: THREE.Scene;

    // Geometry properties
    rectWidth: number;
    rectHeight: number;
    gap: number;
    seekBarOffsetY: number;
    seekBarOffsetX: number;

    // Time properties
    minYear: number;
    numOfYears: number;

    // Scroll management
    pointer: THREE.Vector2;
    containerWidth: number;
    containerHeight: number;

    // Meshes
    seekBars: THREE.Mesh[]; // Store all squares in seek bar

    constructor(sceneManager: SceneManager, STICRead: STICRead) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.rectWidth = 2;
        this.rectHeight = 0.6;
        this.gap = this.rectWidth / 8;
        this.seekBarOffsetY = 0.2;
        this.seekBarOffsetX = -this.rectWidth / 2;

        this.minYear = STICRead.getData('minYear');
        this.numOfYears = STICRead.getData('numOfYears');

        this.pointer = new THREE.Vector2();
        this.containerWidth = STICRead.getData('containerWidth');
        this.containerHeight = STICRead.getData('containerHeight');

        this.seekBars = [];

        this.createSeekBars();
        this.createCenterTick();

        window.addEventListener('pointermove', (event) => this.onPointerMove(event));

    }

    private createSeekBars() {
        const geometry = new THREE.PlaneGeometry(this.rectWidth, this.rectHeight);
        const activeColor = new THREE.MeshBasicMaterial({ color: 0x5f5d61 });
        const inactiveColor = new THREE.MeshBasicMaterial({ color: 0x474649 });

        const createCell = (name: string, position: number, active: boolean) => {
            const mesh = new THREE.Mesh(geometry, active ? activeColor : inactiveColor);
            mesh.position.set(position - this.seekBarOffsetX, this.seekBarOffsetY, 0);
            mesh.name = name;
            this.seekBars.push(mesh);
            this.scene.add(mesh);
        }

        // Inactive leading seek bars: years before minYear
        for (let i = -40; i < 0; i++) {
            createCell('cell_leading', i * this.getDistancePerYear(), false);
        }

        // Active seek bars: years between minYear and maxYear
        for (let i = 0; i < this.numOfYears; i++) {
            createCell(`cell_${(this.minYear + i).toString()}`, i * this.getDistancePerYear(), true);
        }

        // Inactive trailing seek bars: years after maxYear
        for (let i = this.numOfYears; i < this.numOfYears + 40 / 2; i++) {
            createCell('cell_trailing', i * this.getDistancePerYear(), false);
        }
    }

    private createCenterTick() {
        const geometry = new THREE.PlaneGeometry(0.15, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, this.seekBarOffsetY, 0);
        mesh.name = 'center_tick';
        this.scene.add(mesh);
    }

    onPointerMove(event: MouseEvent) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1)
        const pointer = new THREE.Vector2();
        pointer.x = (event.offsetX / this.containerWidth) * 2 - 1;
        pointer.y = -(event.offsetY / this.containerHeight) * 2 + 1;

        const intersects = this.sceneManager.getPointerIntersects(pointer);
        const currentCell = intersects.filter((intersect) => intersect.object.name.includes('cell_'))[0] || null;

        if (currentCell) {
            document.body.style.cursor = 'grab';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    move(distance: number) {
        this.seekBars.forEach((bar) => {
            bar.position.x -= distance;
        });
    }

    getCurrentCell(): THREE.Intersection | null {
        const intersects = this.sceneManager.getCenterIntersects();
        const currentCell = intersects.filter((intersect) => intersect.object.name.includes('cell_'))[0] || null;
        return currentCell;
    }

    getDistancePerYear() {
        return this.rectWidth + this.gap;
    }

}
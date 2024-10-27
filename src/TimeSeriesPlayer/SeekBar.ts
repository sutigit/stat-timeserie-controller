import * as THREE from 'three';
import SceneManager from './SceneManager';
import STICRead from './STICRead';

// utils
import { easeOutQuad } from '../utils';

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
    scrollAllowed: boolean;
    scrollStarted: boolean;
    containerWidth: number;
    containerHeight: number;
    containerBounds: DOMRect;
    isAnimating: boolean;
    scrollingAnimId: number;
    lastX: number;
    currentX: number;

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
        this.scrollAllowed = false;
        this.scrollStarted = false;
        this.containerWidth = STICRead.getData('containerWidth');
        this.containerHeight = STICRead.getData('containerHeight');
        this.containerBounds = STICRead.getData('containerBounds');
        this.isAnimating = false;
        this.scrollingAnimId = 0;
        this.lastX = 0;
        this.currentX = 0;

        this.seekBars = [];

        this.createSeekBars();
        this.createCenterTick();

        // Handle mouse events
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        // TODO: Handle touch events
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

        // make mesh undetectable by raycaster
        mesh.raycast = () => { };

        mesh.position.set(0, this.seekBarOffsetY, 0);

        this.scene.add(mesh);
    }

    private onMouseMove(event: MouseEvent) {
        // calculate pointer position in normalized device coordinates (-1 to +1)
        this.pointer.x = (event.offsetX / this.containerWidth) * 2 - 1;
        this.pointer.y = -(event.offsetY / this.containerHeight) * 2 + 1;

        // Scroll is allowed when mouse is hovering over a cell
        this.scrollAllowed = this.sceneManager.getPointerIntersects(this.pointer).length > 0;

        // Change cursor style based on pointer action
        switch (true) {
            case this.scrollStarted:
                document.body.style.cursor = 'grabbing';
                break;
            case this.scrollAllowed:
                document.body.style.cursor = 'grab';
                break;
            default:
                document.body.style.cursor = 'default';
        }

        if (this.scrollStarted) {
            this.currentX = event.clientX;
            this.startScrollingAnim();
        }
    }

    private onMouseDown(event: MouseEvent) {
        if (this.scrollAllowed) {
            this.currentX = this.lastX = event.clientX;
            this.scrollStarted = true;
        }
    }

    private onMouseUp() {
        this.scrollStarted = false;
        this.isAnimating = false;
    }

    private startScrollingAnim() {
        // Prevent from starting multiple scrolling animations
        if (this.isAnimating) return;

        this.isAnimating = true;

        // Start the scrolling animation
        this.scrollingAnimId = requestAnimationFrame(this.scroll.bind(this));
    }

    private scroll() {
        if (!this.isAnimating) {
            cancelAnimationFrame(this.scrollingAnimId);
            return;
        }
        
        // Move the seek bars
        const step = (this.currentX - this.lastX) / this.containerWidth * 10;
        this.move(-easeOutQuad(step));
        
        this.lastX = this.currentX;

        // Re-render the scene
        this.sceneManager.render();

        requestAnimationFrame(this.scroll.bind(this));
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
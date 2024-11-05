import SceneManager from './components/SceneManager';
import SeekBar from './components/SeekBar';
import YearLabelManager from './components/YearLabelManager';
import Controller from './components/Controller';
import Data from './components/Data';

export default class StatMapController {
    controller: Controller;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    sceneManager: SceneManager;
    data: Data;

    constructor({
        id,
        minYear,
        maxYear
    }: {
        id: string,
        minYear: number,
        maxYear: number
    }) {
        const element = this.setStatMapControllerElement(id);

        this.data = new Data(element, minYear, maxYear);

        this.sceneManager = new SceneManager(this.data);
        this.seekBar = new SeekBar(this.sceneManager, this.data);
        this.yearLabelManager = new YearLabelManager(this.sceneManager, this.data);
        this.controller = new Controller(this.sceneManager, this.seekBar, this.yearLabelManager);

        this.init();
    }

    private setStatMapControllerElement(id: string) {
        const container = document.getElementById(id) as HTMLElement;

        if (container) {
            container.style.backgroundColor = '#221f22de';
            container.style.display = 'flex';
            container.style.borderRadius = '24px';
            container.style.overflow = 'hidden';
            container.style.backdropFilter = 'blur(8px)';

            const element = this.createElement();

            container.appendChild(element);

            return element;
        }
        else {
            throw new Error(`Element with id ${id} not found`);
        }
    }

    private createElement() {
        const element = document.createElement('div');
        element.style.width = '100%';
        element.style.height = '100%';
        // // Add a CSS mask to create the fade-out effect at the edges
        element.style.maskImage = `
                linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)
            `; // TODO: add Safari support
    
        return element;
    }
    

    private init() {
        this.sceneManager.render();
    }
}



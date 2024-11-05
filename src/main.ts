import SceneManager from './TimeSeriesPlayer/SceneManager';
import SeekBar from './TimeSeriesPlayer/SeekBar';
import YearLabelManager from './TimeSeriesPlayer/YearLabelManager';
import Controller from './TimeSeriesPlayer/Controller';
import STICRead from './TimeSeriesPlayer/STICRead';

export default class StatMapController {
    controller: Controller;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    sceneManager: SceneManager;
    STICRead: STICRead;

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

        this.STICRead = new STICRead(element, minYear, maxYear);
        this.sceneManager = new SceneManager(this.STICRead);
        this.seekBar = new SeekBar(this.sceneManager, this.STICRead);
        this.yearLabelManager = new YearLabelManager(this.sceneManager, this.STICRead);
        this.controller = new Controller(this.sceneManager, this.seekBar, this.yearLabelManager, this.STICRead);

        this.init();
    }

    setStatMapControllerElement(id: string) {
        const container = document.getElementById(id) as HTMLDivElement;

        if (container) {
            container.style.width = '600px';
            container.style.height = '160px';
            container.style.backgroundColor = '#221f22de';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            container.style.borderRadius = '24px';
            container.style.overflow = 'hidden';
            container.style.backdropFilter = 'blur(8px)';

            const timeseries = this.createTimeSeriesPlayer();

            container.appendChild(timeseries);

            return timeseries;
        }
        else {
            throw new Error(`Element with id ${id} not found`);
        }
    }

    createTimeSeriesPlayer() {
        const timeseries = document.createElement('div');
        timeseries.id = 'target';
        timeseries.style.width = '100%';
        timeseries.style.height = '100%';
        timeseries.style.position = 'relative';
        // // Add a CSS mask to create the fade-out effect at the edges
        timeseries.style.maskImage = `
                linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)
            `; // TODO: add Safari support
    
        return timeseries;
    }
    

    private init() {
        this.sceneManager.render();
    }
}



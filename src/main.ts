import SceneManager from './TimeSeriesPlayer/SceneManager';
import SeekBar from './TimeSeriesPlayer/SeekBar';
import YearLabelManager from './TimeSeriesPlayer/YearLabelManager';
import Controller from './TimeSeriesPlayer/Controller';
import Environment from './Environment';

class App {
    sceneManager: SceneManager;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    controller: Controller;

    constructor(hostComponent: HTMLDivElement) {
        this.sceneManager = new SceneManager(hostComponent);

        this.seekBar = new SeekBar(this.sceneManager);
        this.yearLabelManager = new YearLabelManager(this.sceneManager);
        
        this.controller = new Controller(this.sceneManager, this.seekBar, this.yearLabelManager);

        this.init();
    }

    init() {
        this.sceneManager.render();
    }
}

// Initialize the application
const hostEnv = new Environment();
const hostComponent = hostEnv.getTimeSeriesPlayer();
new App(hostComponent);

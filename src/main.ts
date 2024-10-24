import SceneManager from './TimeSeriesPlayer/SceneManager';
import SeekBar from './TimeSeriesPlayer/SeekBar';
import YearLabelManager from './TimeSeriesPlayer/YearLabelManager';
import Controller from './TimeSeriesPlayer/Controller';
import Environment from './Environment';

class App {
    environment: Environment;
    sceneManager: SceneManager;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    controller: Controller;

    constructor() {
        this.environment = new Environment();
        this.sceneManager = new SceneManager(this.environment.getTimeSeriesPlayer());

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
new App();

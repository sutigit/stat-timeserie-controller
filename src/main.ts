import SceneManager from './TimeSeriesPlayer/SceneManager';
import SeekBar from './TimeSeriesPlayer/SeekBar';
import YearLabelManager from './TimeSeriesPlayer/YearLabelManager';
import Controller from './TimeSeriesPlayer/Controller';
import Environment from './Environment';
import STICRead from './TimeSeriesPlayer/STICRead';

class App {
    controller: Controller;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    sceneManager: SceneManager;
    STICRead: STICRead;

    constructor(container: HTMLDivElement, minYear: number, maxYear: number) {
        this.STICRead = new STICRead(container, minYear, maxYear);

        this.sceneManager = new SceneManager(this.STICRead);
        this.seekBar = new SeekBar(this.sceneManager, this.STICRead);
        this.yearLabelManager = new YearLabelManager(this.sceneManager, this.STICRead);
        
        this.controller = new Controller(this.sceneManager, this.seekBar, this.yearLabelManager, this.STICRead);

        this.init();
    }

    private init() {
        this.sceneManager.render();
    }
}

// Initialize the application
const hostEnv = new Environment();
const container = hostEnv.getTimeSeriesPlayer();

new App(container, 1987, 2024);

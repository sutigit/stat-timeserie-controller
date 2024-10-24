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

    constructor(hostComponent: HTMLDivElement) {
        this.sceneManager = new SceneManager(hostComponent);

        this.seekBar = new SeekBar(this.sceneManager);
        this.yearLabelManager = new YearLabelManager(this.sceneManager);
        this.STICRead = new STICRead();
        
        this.controller = new Controller(this.sceneManager, this.seekBar, this.yearLabelManager, this.STICRead);

        this.init();
    }

    private init() {
        this.sceneManager.render();
    }

    readData() {
        this.STICRead.readData();
    }
}

// Initialize the application
const hostEnv = new Environment();
const hostComponent = hostEnv.getTimeSeriesPlayer();
new App(hostComponent);

import SceneManager from './TimeSeriesPlayer/SceneManager';
import SeekBar from './TimeSeriesPlayer/SeekBar';
import YearLabelManager from './TimeSeriesPlayer/YearLabelManager';
import PlayButton from './TimeSeriesPlayer/PlayButton';
import Environment from './Environment';

class App {
    environment: Environment;
    sceneManager: SceneManager;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    playButton: PlayButton;

    constructor() {
        this.environment = new Environment();
        this.sceneManager = new SceneManager(this.environment.getTimeSeriesPlayer());

        this.seekBar = new SeekBar(this.sceneManager);
        this.yearLabelManager = new YearLabelManager(this.sceneManager.getScene());
        this.playButton = new PlayButton(this.sceneManager.getScene());

        this.init();
    }

    init() {
        this.sceneManager.render();
    }
}

// Initialize the application
new App();

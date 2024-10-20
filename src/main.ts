import SceneManager from './TimeSeriesPlayer/SceneManager';
import SeekBar from './TimeSeriesPlayer/SeekBar';
import YearLabelManager from './TimeSeriesPlayer/YearLabelManager';
import PlayButton from './TimeSeriesPlayer/PlayButton';

class Environment {
    container: HTMLDivElement;
    timeseries: HTMLDivElement;

    constructor() {
        this.setupBodyStyle();
        this.container = this.createContainer();
        this.timeseries = this.createTimeSeriesPlayer();
        this.container.appendChild(this.timeseries);
        document.body.appendChild(this.container);
    }

    setupBodyStyle() {
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.backgroundImage = 'url(https://media.istockphoto.com/id/1411803980/vector/detailed-world-map-with-divided-countries-on-a-transparent-background.jpg?s=612x612&w=0&k=20&c=D0z5IYiAqDXVdNCyNJeH2WcseqXfM3KodS1iu9rtEZY=)';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.margin = '0';
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.width = '600px';
        container.style.height = '160px';
        container.style.backgroundColor = '#221f22de';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.marginTop = '300px';
        container.style.borderRadius = '24px';
        container.style.overflow = 'hidden';
        container.style.backdropFilter = 'blur(8px)';
        return container;
    }

    createTimeSeriesPlayer() {
        const timeseries = document.createElement('div');
        timeseries.style.width = '100%';
        timeseries.style.height = '100%';
        timeseries.style.position = 'relative';
        // // Add a CSS mask to create the fade-out effect at the edges
        timeseries.style.maskImage = `
            linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)
        `; // TODO: add Safari support

        return timeseries;
    }

    getTimeSeriesPlayer() {
        return this.timeseries;
    }
}


class App {
    environment: Environment;
    sceneManager: SceneManager;
    seekBar: SeekBar;
    yearLabelManager: YearLabelManager;
    playButton: PlayButton;

    constructor() {
        this.environment = new Environment();
        this.sceneManager = new SceneManager(this.environment.getTimeSeriesPlayer());

        this.seekBar = new SeekBar(this.sceneManager.getScene());
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

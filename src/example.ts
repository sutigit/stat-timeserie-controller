import StatMapController from './main';
import Environment from './Environment';

// Create a div element to render the controller
// const myDiv = document.createElement('div');
// myDiv.id = 'myDiv';
// myDiv.style.width = '600px';
// myDiv.style.height = '160px';
// document.querySelector('#app')?.appendChild(myDiv);


// EXAMPLE USAGE

// Initialize the application
const hostEnv = new Environment();
const container = hostEnv.getTimeSeriesPlayer();

new StatMapController(container, 1987, 2024);


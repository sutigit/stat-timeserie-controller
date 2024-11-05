// Simulating a target div from your project
const myDiv = document.createElement('div');
myDiv.id = 'target';
myDiv.style.width = '600px';
myDiv.style.height = '160px';
document.querySelector('#app')?.appendChild(myDiv);


// EXAMPLE USAGE

// import
import StatMapController from './main';

// instantiate
new StatMapController({
    id: 'target',
    minYear: 1987,
    maxYear: 2024
});


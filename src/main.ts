import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import PlayIcon from './src/play.svg';

// Style body element ---------------------------------------------------------------------
document.body.style.width = '100%';
document.body.style.height = '100%';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';

// Set background image
document.body.style.backgroundImage = 'url(https://media.istockphoto.com/id/1411803980/vector/detailed-world-map-with-divided-countries-on-a-transparent-background.jpg?s=612x612&w=0&k=20&c=D0z5IYiAqDXVdNCyNJeH2WcseqXfM3KodS1iu9rtEZY=)'
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';

// Remove margin
document.body.style.margin = '0';

// Create container element ---------------------------------------------------------------
const container = document.createElement('div');

// Give css style
container.style.width = '600px';
container.style.height = '160px';
container.style.backgroundColor = '#221f22de';
container.style.display = 'flex';
container.style.justifyContent = 'center';
container.style.alignItems = 'center';

container.style.marginTop = '750px';
// Rounded borders
container.style.borderRadius = '24px';
// overflow hidden
container.style.overflow = 'hidden';

// Add a background blur effect
container.style.backdropFilter = 'blur(8px)'; // TODO: add Safari support




// add it to the body
document.body.appendChild(container);


// Create timeseries element ---------------------------------------------------------------

const timeseries = document.createElement('div');
timeseries.style.width = '100%';
timeseries.style.height = '100%';
timeseries.style.position = 'relative';
// Add a CSS mask to create the fade-out effect at the edges
timeseries.style.maskImage = `
linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)
`; // TODO: add Safari support

container.appendChild(timeseries);



// THREE.js starts from here!! --------------------------------------------------------------------------------

// Create a scene, camera, renderer and label renderer ------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
timeseries.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(container.offsetWidth, container.offsetHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
timeseries.appendChild(labelRenderer.domElement);


// Adding shapes here --------------------------------------------------------------------
// Create a square with PlaneGeometry
const sqWidth = 1;
const sqHeight = 0.6;
const timeseriesGeom = new THREE.PlaneGeometry(sqWidth, sqHeight);  // 2x1 rectangle
const timeseriesMat = new THREE.MeshBasicMaterial({ color: 0x5f5d61, side: THREE.DoubleSide });


// Add timeseries rectangles to the scene
const gap = sqWidth / 4; // This is the gap size between each square
const numYears = 2100 - 1800;

for (let i = -numYears / 2; i < numYears / 2; i++) {
    const square = new THREE.Mesh(timeseriesGeom, timeseriesMat);
    square.position.set(i * (sqWidth + gap) + (sqWidth / 2), 0.2, 0);  // Multiply by (sqWidth + gap)
    scene.add(square);
}

// Add center rectangle to the scene
const centerGeom = new THREE.PlaneGeometry(0.15, 1);
const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

const tick = new THREE.Mesh(centerGeom, centerMat);
tick.position.set(0, 0.2, 0);
scene.add(tick);



// Add texts to the scene ----------------------------------------------------------------
for (let i = -numYears / 2; i < numYears / 2; i++) {
    // Create a DOM element for year label)
    const year = document.createElement('div');

    const yearNum = 1987 + i;
    year.style.color = '#ffffff';
    year.style.fontFamily = 'Monospace';
    year.style.fontWeight = 'bold';
    year.style.fontSize = '12px'
    year.textContent = yearNum.toString();

    if (yearNum === 1987) {
        year.style.fontSize = '24px';
    }

    const label = new CSS2DObject(year);
    label.position.set(i * 4, 2, 0);
    scene.add(label);
}



// Add controllers to the scene ----------------------------------------------------------
const playPauseButton = document.createElement('img');
playPauseButton.src = 'src/play.svg'; // Initial state: Play button
playPauseButton.style.width = '38px';
playPauseButton.style.height = '38px';
playPauseButton.style.cursor = 'pointer';

let isPlaying = false;

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        // Currently playing, switch to pause state
        console.log('pause button clicked');
        playPauseButton.src = 'src/play.svg'; // Switch to play icon
    } else {
        // Currently paused, switch to play state
        console.log('play button clicked');
        playPauseButton.src = 'src/pause.svg'; // Switch to pause icon
    }
    isPlaying = !isPlaying; // Toggle the state
});

const tPlayPauseButton = new CSS2DObject(playPauseButton);
tPlayPauseButton.position.set(0, -2, 0);

scene.add(tPlayPauseButton);





// Set camera position
camera.position.z = 5;

// Camera background transparent
renderer.setClearColor(0x000000, 0);

// Render the scene
renderer.render(scene, camera);
labelRenderer.render(scene, camera);




// Render loop
// function animate() {
//     requestAnimationFrame(animate);
//     square.rotation.x += 0.01;
//     square.rotation.y += 0.01;
// }

// animate();



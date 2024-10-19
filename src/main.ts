import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Style body element ---------------------------------------------------------------------
document.body.style.width = '100%';
document.body.style.height = '100%';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';

// Create container element ---------------------------------------------------------------
const container = document.createElement('div');

// Give css style
container.style.width = '600px';
container.style.height = '400px';
container.style.marginTop = '300px';
// Rounded borders
container.style.borderRadius = '12px';
// overflow hidden
container.style.overflow = 'hidden';

// add it to the body
document.body.appendChild(container);



// THREE.js starts from here!!

// Create a scene, camera and renderer ---------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);


// Adding shapes here --------------------------------------------------------------------
// Create a square with PlaneGeometry
const sqWidth = 0.5;
const sqHeight = 0.5;
const timeseriesGeom = new THREE.PlaneGeometry(sqWidth, sqHeight);  // 2x1 rectangle
const timeseriesMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });


// Add timeseries rects to the scene
const gap = sqWidth / 4; // This is the gap size between each square
const numYears = 2100 - 1800;

for (let i = -numYears / 2; i < numYears / 2; i++) {
    const square = new THREE.Mesh(timeseriesGeom, timeseriesMat);
    square.position.setX(i * (sqWidth + gap) + (sqWidth / 2));  // Multiply by (sqWidth + gap)
    scene.add(square);
}

// Add center rect to the scene
const centerGeom = new THREE.PlaneGeometry(0.1, 1);
const centerMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });

const square = new THREE.Mesh(centerGeom, centerMat);
scene.add(square);

camera.position.z = 5;
renderer.render(scene, camera);

// Add texts geometry
const moonDiv = document.createElement( 'div' );
moonDiv.textContent = 'Moon';
moonDiv.style.color = 'white';
moonDiv.style.backgroundColor = 'transparent';

const moonLabel = new CSS2DObject( moonDiv );
moonLabel.position.set( 1.5, 1, 0 );
moonLabel.center.set( 0, 1 );
scene.add( moonLabel );
moonLabel.layers.set( 0 );

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );




// Set camera position
camera.position.z = 5;

// Render the scene
renderer.render(scene, camera);




// Render loop
// function animate() {
//     requestAnimationFrame(animate);
//     square.rotation.x += 0.01;
//     square.rotation.y += 0.01;
// }

// animate();

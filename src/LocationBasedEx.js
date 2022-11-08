import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import * as THREEAR from 'threear'
import Canvas from './Canvas';

const THREEx = require('@ar-js-org/ar.js/three.js/build/ar-threex-location-only') 


function LocationBasedEx() {


  const ref = useRef(null);
  const ref2 = useRef(null);

  let refCanvas;
  let refVideo;

  useEffect(() => {
    refCanvas = ref.current;
    refVideo = ref2.current;
  }, [])

  function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        return true;
    }
    return false;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ canvas: refCanvas });

camera.position.z = 5;

// const renderer = new THREE.WebGLRenderer({
//   // antialias	: true,
//   alpha: true
// });

const geom = new THREE.BoxGeometry(20,20,20);

const threex = new THREEx.LocationBased(scene, camera);

// You can change the minimum GPS accuracy needed to register a position - by default 1000m
//const threex = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
const cam = new THREEx.WebcamRenderer(renderer, refVideo);

// const oneDegAsRad = THREE.MathUtils.degToRad(1);

const render = (time) => {
  // resizeUpdate();
  if(orientationControls) orientationControls.update();
  cam.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

const resizeUpdate = () => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth, height = canvas.clientHeight;
  if(width != canvas.width || height != canvas.height) {
      renderer.setSize(width, height, false);
  }
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

const setupObjects = (longitude, latitude) => {
  // Use position of first GPS update (fake or real)
  const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
  const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
  const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
  threex.add(new THREE.Mesh(geom, material), longitude, latitude + 0.001); // slightly north
  threex.add(new THREE.Mesh(geom, material2), longitude, latitude - 0.001); // slightly south
  threex.add(new THREE.Mesh(geom, material3), longitude - 0.001, latitude); // slightly west
  threex.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
}


let orientationControls;

if (isMobile()){   
    orientationControls = new THREEx.DeviceOrientationControls(camera);
} 

let fake = null;
let first = true;

threex.on("gpsupdate", pos => {
    console.log('gpsupdate');
    if(first) {
        setupObjects(pos.coords.longitude, pos.coords.latitude);
        first = false;
    }
});

threex.on("gpserror", code => {
    alert(`GPS error: code ${code}`);
});

// Uncomment to use a fake GPS location
fake = { lat: 29.803050, lon : -95.415780 };
if(fake) {
    threex.fakeGps(fake.lon, fake.lat);
} else {
    threex.startGps();
} 

requestAnimationFrame(render);



let mousedown = false, lastX =0;

// // Mouse events for testing on desktop machine
// if(!isMobile()) {
//     window.addEventListener("mousedown", e=> {
//         mousedown = true;
//     });

//     window.addEventListener("mouseup", e=> {
//         mousedown = false;
//     });

//     window.addEventListener("mousemove", e=> {
//         if(!mousedown) return;
//         if(e.clientX < lastX) {
//             camera.rotation.y -= oneDegAsRad; 
//             if(camera.rotation.y < 0) {
//                 camera.rotation.y += 2 * Math.PI;
//             }
//         } else if (e.clientX > lastX) {
//             camera.rotation.y += oneDegAsRad;
//             if(camera.rotation.y > 2 * Math.PI) {
//                 camera.rotation.y -= 2 * Math.PI;
//             }
//         }
//         lastX = e.clientX;
//     });
//}

  return (
    <div>
      <canvas ref={refCanvas} id="canvas1" style={{backgroundColor: "black", width: "100%", height: "100%", display: "block"}}></canvas>
      <video ref={refVideo} id='video1' autoPlay playsInline style={{display: "none"}}></video>

    </div>
  )
}

export default LocationBasedEx
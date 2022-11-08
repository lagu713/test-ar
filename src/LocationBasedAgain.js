import { useEffect, useRef } from 'react';
import * as THREE from 'three'

const THREEx = require('@ar-js-org/ar.js/three.js/build/ar-threex-location-only') 

function LocationBasedAgain() {


  let renderer = null

  // const ref = useRef(null);
  // const ref2 = useRef(null);

  const canvasInner = useRef(null)
  const videoInner = useRef(null)

  // let canvasInner
  // let videoInner

  useEffect(() => {
    // canvasInner = ref.current;
    // videoInner = ref2.current;
    // canvasInner = document.querySelector('canvas1')
    console.log(canvasInner)

    // videoInner = document.querySelector('video1')
    console.log(videoInner)
    if (canvasInner && videoInner)
    {

      setupCamera()
    }



      }, []);

  function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        return true;
    }
    return false;
  }

  function setupCamera() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    renderer = new THREE.WebGLRenderer({ canvas: canvasInner.current});
    
    const geom = new THREE.BoxGeometry(20,20,20);
    
    const threex = new THREEx.LocationBased(scene, camera);
    
    // You can change the minimum GPS accuracy needed to register a position - by default 1000m
    //const threex = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
    const cam = new THREEx.WebcamRenderer(renderer, '#videoInn');
    
    const oneDegAsRad = THREE.MathUtils.degToRad(1) // Math.degToRad(1);

    let orientationControls;
  
    if (isMobile()){   
      orientationControls = new THREEx.DeviceOrientationControls(camera);
    } 
    
    let fake = null;
    let first = true;
    
    threex.on("gpsupdate", pos => {
      console.log('gpsupdate');
      if(first) {
          setupObjects(pos.coords.longitude, pos.coords.latitude, geom, threex);
          first = false;
      }
    });
    
    threex.on("gpserror", code => {
      alert(`GPS error: code ${code}`);
    });
    
    // Uncomment to use a fake GPS location
    //fake = { lat: 51.05, lon : -0.72 };
    if(fake) {
      threex.fakeGps(fake.lon, fake.lat);
    } else {
      threex.startGps();
    } 
    
    requestAnimationFrame(render(null, orientationControls, cam, render, scene, camera));
    
    
    
    let mousedown = false, lastX =0;
    
    // Mouse events for testing on desktop machine
    if(!isMobile()) {
      window.addEventListener("mousedown", e=> {
          mousedown = true;
      });
    
      window.addEventListener("mouseup", e=> {
          mousedown = false;
      });
    
      window.addEventListener("mousemove", e=> {
          if(!mousedown) return;
          if(e.clientX < lastX) {
              camera.rotation.y -= oneDegAsRad; 
              if(camera.rotation.y < 0) {
                  camera.rotation.y += 2 * THREE.MathUtils.PI;
              }
          } else if (e.clientX > lastX) {
              camera.rotation.y += oneDegAsRad;
              if(camera.rotation.y > 2 * THREE.MathUtils.PI) {
                  camera.rotation.y -= 2 * THREE.MathUtils.PI;
              }
          }
          lastX = e.clientX;
      });
  }
  

  
  

  }
  
  function render(time, orientationControls, cam, render, scene, camera) {
    resizeUpdate(camera);
    if(orientationControls) orientationControls.update();
    cam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render(null, orientationControls, cam, render, scene, camera));
  }
  
  function resizeUpdate(camera) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if(width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
    }
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  function setupObjects(longitude, latitude, geom, threex) {
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

  return (
    <div>
      <video ref={videoInner} id='videoInn' autoPlay playsInline style={{display: "none"}}></video>
      <canvas ref={canvasInner} id="canvasInn" style={{backgroundColor: "black", width: "100%", height: "100%", display: "block"}}></canvas>
    </div>
  )
}
export default LocationBasedAgain;




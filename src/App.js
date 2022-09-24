import logo from './logo.svg';
import './App.css';
import * as THREE from 'three'
import * as THREEAR from 'threear'

function App() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({
      // antialias	: true,
      alpha: true
    });

  var markerGroup = new THREE.Group();
  scene.add(markerGroup);

  var source = new THREEAR.Source({ renderer, camera });

  THREEAR.initialize({ source: source }).then((controller) => {
    /* Three.js code here (mesh, materials... to be attached to the marker)*/
    var path = './data/patt.hiro';
    var patternMarker = new THREEAR.PatternMarker({
          patternUrl: path,
          markerObject: markerGroup
        });
    controller.trackMarker(patternMarker);

    requestAnimationFrame(function animate(nowMsec){
      // measure time
      // your measure time code here
      renderer.render( scene, camera );
      controller.update( source.domElement );

      // keep looping
      requestAnimationFrame( animate );
      });
    })

  return (
    <div></div>
  );
}

export default App;

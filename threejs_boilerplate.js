import * as t from 'three';
const container = document.getElementById('container');
const renderer = new t.WebGLRenderer( { antialias: false } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = t.sRGBEncoding;
container.appendChild( renderer.domElement );

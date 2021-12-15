

var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;

var mesh1;

// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: {
    facingMode: 'environment'
  } }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

initialize();
animate();

function initialize()
{
	
	// Elements for taking the snapshot
// var canvas = document.getElementById('canvas');
var testcanv = document.getElementById('testecanv');
var context = canvas.getContext('2d');
// var video = document.getElementById('video');

// // Trigger photo take
// document.getElementById("snap").addEventListener("click", function() {
	// context.drawImage(video, 0, 0, 640, 480);
// });
	
	scene = new THREE.Scene();

	//let ambientLight = new THREE.AmbientLight( 0xcccccc, 1.0 );
	//scene.add( ambientLight );
				
	// const spotLight = new THREE.SpotLight(0xffffff);
  
  
  

	// spotLight.position.set(0, 0, 0);
	// spotLight.castShadow = true;

	// scene.add(spotLight);
	
	
		
	const spotLight = new THREE.SpotLight( 0x84a7d0 );
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );


	
	// scene.add(new THREE.AmbientLight(0xffffff));
	scene.add(new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5));

	 camera = new THREE.Camera();
	// camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
	
		
		
		scene.add(camera);
	
	// var renderer = new THREE.WebGLRenderer( { canvas: testcanv } );
	// renderer.setSize(500, 400);
	

	renderer = new THREE.WebGLRenderer({
	antialias : true,
	alpha: true
	});


	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	//renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
	
	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		//onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/data/patt.hiro",
		// type: 'pattern', patternUrl: "data/data/pattern-patt.hiro",
        //https://iondrimba.github.io/augmented-reality/public/data/data/hiro.patt
	})

	let geometry1 = new THREE.PlaneBufferGeometry(1,1, 4,4);
	let loader = new THREE.TextureLoader();
	// let texture = loader.load( 'images/earth.jpg', render );
	let material1 = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.5 } );
	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.rotation.x = -Math.PI/2;
	markerRoot1.add( mesh1 );
	
	function onProgress(xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }
	function onError(xhr) { console.log( 'An error happened' ); }
	
	new THREE.MTLLoader()
		//.setPath( 'models/' )
		.load( 'model/Project_Screw_2.mtl', function ( materials ) {
			materials.preload();
			new THREE.OBJLoader()
				.setMaterials( materials )
				//.setPath( 'models/' )
				.load( 'model/Project_Screw_2.obj', function ( group ) {
					mesh0 = group.children[0];
					mesh0.material.side = THREE.DoubleSide;
					mesh0.position.y = 0.25;
					mesh0.scale.set(0.05,0.05,0.05);
					markerRoot1.add(mesh0);
				}, onProgress, onError );
		});
}


function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}


function render()
{

	
	renderer.render( scene, camera );
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}

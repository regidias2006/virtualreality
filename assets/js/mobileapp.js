
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: {
        facingMode: 'environment'
      } }).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            //video.srcObject = stream;
            //video.play();
        });
    }

	//////////////////////////////////////////////////////////////////////////////////
	//		Init
	//////////////////////////////////////////////////////////////////////////////////
	// init renderer
	var renderer	= new THREE.WebGLRenderer({
		// antialias	: true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	// renderer.setPixelRatio( 1/2 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );
	// array of functions for the rendering loop
	var onRenderFcts= [];
	// init scene and camera
	var scene = new THREE.Scene();
	//////////////////////////////////////////////////////////////////////////////////
	//		Initialize a basic camera
	//////////////////////////////////////////////////////////////////////////////////
	// Create a camera
	var camera = new THREE.Camera();
	scene.add(camera);

	////////////////////////////////////////////////////////////////////////////////
	//          CREATE LIGHTS
	////////////////////////////////////////////////////////////////////////////////
    scene.add(new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5));


	////////////////////////////////////////////////////////////////////////////////
	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////
	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam
		sourceType : 'webcam',
		// to read from an image
		// sourceType : 'image',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
		// to read from a video
		// sourceType : 'video',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
	})
	arToolkitSource.init(function onReady(){
		onResize()
	})
	// handle resize
	window.addEventListener('resize', function(){
		onResize()
	})
	function onResize(){
		arToolkitSource.onResizeElement()
		arToolkitSource.copyElementSizeTo(renderer.domElement)
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
		}
	}
	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////
	// create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/data/camera_para.dat',
		detectionMode: 'mono',
		maxDetectionRate: 30,
		canvasWidth: 80*3,
		canvasHeight: 60*3,
	})
	// initialize it
	arToolkitContext.init(function onCompleted(){
		// copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	})
	// update artoolkit on every frame
	onRenderFcts.push(function(){
		if( arToolkitSource.ready === false )	return
		arToolkitContext.update( arToolkitSource.domElement )
	})
	////////////////////////////////////////////////////////////////////////////////
	//          Create a ArMarkerControls
	////////////////////////////////////////////////////////////////////////////////
	// var markerRoot = new THREE.Group
	// scene.add(markerRoot)
	// //HERE we define the marker... specify here your .patt file
	// var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
	// 	type : 'pattern',
	// 	patternUrl : 'data/data/patt.hiro'
	// })
	// // build a smoothedControls
	// var smoothedRoot = new THREE.Group()
	// scene.add(smoothedRoot)
	// var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
	// 	lerpPosition: 0.4,
	// 	lerpQuaternion: 0.3,
	// 	lerpScale: 1,
	// })
	// onRenderFcts.push(function(delta){
	// 	smoothedControls.update(markerRoot)
	// })

    // build markerControls
    markerRoot1 = new THREE.Group();
    scene.add(markerRoot1);
    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
        type: 'pattern', patternUrl: "data/data/patt.hiro",
        // type: 'pattern', patternUrl: "data/data/pattern-patt.hiro",
        //https://iondrimba.github.io/augmented-reality/public/data/data/hiro.patt
    })



	//////////////////////////////////////////////////////////////////////////////////
	//		add an object in the scene
	//////////////////////////////////////////////////////////////////////////////////
	// var arWorldRoot = smoothedRoot
	// // add a torus knot
	// var geometry	= new THREE.BoxGeometry(1,1,1);
	// var material	= new THREE.MeshNormalMaterial({
	// 	transparent : true,
	// 	opacity: 0.5,
	// 	side: THREE.DoubleSide
	// });
	// var mesh	= new THREE.Mesh( geometry, material );
	// mesh.position.y	= geometry.parameters.height/2
	// arWorldRoot.add( mesh );
	// var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
	// var material	= new THREE.MeshNormalMaterial();
	// var mesh	= new THREE.Mesh( geometry, material );
	// mesh.position.y	= 0.5
	// arWorldRoot.add( mesh );
	// onRenderFcts.push(function(){
	// 	mesh.rotation.x += 0.1
	// })

   

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

	//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////

    

	var stats = new Stats();
	document.body.appendChild( stats.dom );

	// render the scene
	onRenderFcts.push(function(){
		renderer.render( scene, camera );
		stats.update();
	})
	// run the rendering loop
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})



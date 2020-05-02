<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Micicle</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <script src="https://threejs.org/build/three.min.js"></script>
    <script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
    <script src="https://stemkoski.github.io/Three.js/js/Stats.js"></script>
    <script src="https://preview.babylonjs.com/recast.js"></script>
    <script src="./babylon.max.js"></script>
    <script src="//cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://rawcdn.githack.com/mrdoob/three.js/master/examples/js/utils/BufferGeometryUtils.js"></script>
    <script src="https://threejs-path.glitch.me/csg.js"></script>
    <script src="./animationUtils.js"></script>
    <script src="./recast-ext.js"></script>
    <script src="./mazeGen.js"></script>
        <style>
      body,
      html{
          overflow: hidden;
          margin: 0;
          padding: 0;
      }
    </style>
    </head>  
  <body>
  <script>
    THREE.TextureLoader.crossOrigin = '';
    var textureLoader = new THREE.TextureLoader();
    var SIMWORLD = {
    canvas: null,
    stats: null,
    scene: null,
    renderer: null,
    camera: null,
    control: null,
    clock: new THREE.Clock(),
    mouse: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    mixers: [],
    navMeshes: [],
    alpha: 0,
    enem_dir: new THREE.Vector3(0, 0, 0),
    player_dir: new THREE.Vector3(0, 0, 0),
    agentPos: new THREE.Vector3(0, 0, 0),
    playerPos: new THREE.Vector3(0, 0, 0),
    navigationPlugin: new BABYLON.RecastJSPlugin(),
    crowd: null,
    player: null,
    collided: false,
    player_transforms: [],
    transform: null,
    maze: null,
    fruitsInv: [],
    score: 0,
    scoreMap: null,
    messageMap: null,
    collision_frequency: 0,
    refreshTimeout: 0,
    pathLines: new THREE.Line( null, null ),
    agentsMesh: [],
    mazeplayer: null,
    mazenemy: null,
    assetloader: new THREE.GLTFLoader(),
    
      Initialize: function() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            // precision: 'lowp'
        });
        this.renderer.setClearColor(new THREE.Color("#AC886E").multiplyScalar(.3));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        //this.renderer.shadowMap.enabled = true;
        this.scene = new THREE.Scene();
        // camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(2.1776441902258075, 8.140776488170516, 1.6306483337492896);
        this.camera.lookAt(this.scene.position);

        var scene = this.scene
        var renderer = this.renderer
        var camera = this.camera

        this.control = new THREE.OrbitControls(camera, renderer.domElement);
        this.control.enabled = false
        //scene.add(new THREE.AmbientLight(new THREE.Color("#485761").multiplyScalar(2.)));
        this.light = new THREE.PointLight("green");
        this.light.position.set(100, 250, 250);
        scene.add(this.light);
        
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.zIndex = 100;
        document.body.appendChild(this.stats.domElement);
        
        this.maze = new SIMWORLD.createMaze()
        scene.add(this.maze)
        
        this.scoreBoard = SIMWORLD.createUI(false)
        this.messageBoard = SIMWORLD.createUI(true)
        this.messageBoard.position.y = 100
        SIMWORLD.createNavMesh()
        var enemy_pos = new THREE.Vector3(4.773891149291421, 0.009999983012676239, 4.584769303996091)
        var player_pos = new THREE.Vector3( -3.8255241623585072, 0.009999983012678015, -5.777664926555309)
        this.crowd = SIMWORLD.createCrowd(1, enemy_pos, "enemy")
        this.player = SIMWORLD.createCrowd(1, player_pos, "player")
        document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
        window.addEventListener('resize', this.onWindowResize, false);
        
        
      },
      onWindowResize: function(event) {
        var camera = this.camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
      createMaze: function(){
      var scene = SIMWORLD.scene
      var fruitsInv = SIMWORLD.fruitsInv
      var texture = textureLoader.load('https://cdn.glitch.com/e1f07ec4-c6d7-451f-9b46-e49295350009%2Fc7ef8094f5014db6de1e6c3bf6c3d0ed.jpg?v=1571693060181')
      var n = .1
      var geom = new THREE.Geometry();
      var board = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [ 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [ 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
        [ 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
        [ 0, 0, 1, 1, -1, 1, 1, 0, 1, 0],
        [ 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
        [ 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [ 1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
        [ 1, 0, 1, 0, 1, 1, 0, 0, 0, 0]
    ];

    var brickGeometry = new THREE.BoxGeometry(50*n, 50*n, 5);
    

     var scalar = .15
     var n = 1.
     var board = createMaze(10*n, 10*n, 65,65);
     for(var y = 0; y < board.length-2; y++){
        for(var x = 0; x < board[y].length-2; x++){
            //Draw a wall   
    if(board[y][x] === true){
    var brick = new THREE.Mesh(brickGeometry);
   
    brick.position.x = ((x*5)-(22*n))*scalar
    brick.position.z = ((y*5)-(22*n))*scalar
    brick.scale.set(scalar, scalar*2, scalar)
    brick.updateMatrixWorld();
    geom.merge(brick.geometry, brick.matrix);
    geom.mergeVertices(); // optional

            }else{
              if(Math.round(Math.random()*5) == 0){
                var fruits = new THREE.Mesh(new THREE.SphereBufferGeometry(5, 5, 5))//fruits lying around
                scene.add(fruits)
                fruits.position.x = ((x*5)-22*n)*scalar
                fruits.position.z = ((y*5)-22*n)*scalar
                fruits.scale.set(.02, .02, .02)
                fruitsInv.push(fruits)
                
                 if(fruitsInv[0] != undefined)SIMWORLD.mazeplayer =  fruitsInv[0].position//console.log(emptypos[2])
                 if(fruitsInv[fruitsInv.length - 1] != undefined)SIMWORLD.mazenemy =  fruitsInv[fruitsInv.length - 1].position//console.log(emptypos[1])
              }
            }
          if(board[y][x] === -1){
            var brick = new THREE.Mesh(brickGeometry, new THREE.MeshBasicMaterial({color: "cyan"}));
            brick.position.x = ((x*5)-22)*scalar
            brick.position.z = ((y*5)-22)*scalar
            brick.scale.set(scalar, scalar*2, scalar)
            scene.add(brick)
          }
          
        }
     }

        var planeGeometry = new THREE.BoxGeometry(10*n, 10*n, .0001);
        planeGeometry.rotateX(-Math.PI / 2)

        var planeMaterial = new THREE.MeshLambertMaterial({
            color: "green",
            side: THREE.DoubleSide
        });
        plane = new THREE.Mesh(planeGeometry);
       
        plane.updateMatrixWorld();
        geom.merge(plane.geometry, plane.matrix);
        geom.mergeVertices(); // optional

        
        var meshC_buffergeometry = new THREE.BufferGeometry().fromGeometry(geom)
        var meshC_indexed_buffergeometry = THREE.BufferGeometryUtils.mergeVertices( meshC_buffergeometry, .0 )
        
        var maze = new THREE.Mesh(meshC_indexed_buffergeometry,new THREE.MeshLambertMaterial({
        color: new THREE.Color("white"),
          map: texture
        }))

        return maze;
      },
      createNavMesh: function(){
        var scene = this.scene
        var maze = this.maze
        var navMeshes = this.navMeshes
        var navigationPlugin = this.navigationPlugin
        var navmeshParameters = {
        cs: 0.04,
        ch: 0.04,
        walkableSlopeAngle: 35,
        walkableHeight: 1,
        walkableClimb: 1,
        walkableRadius: 1,
        maxEdgeLen: 12.,
        maxSimplificationError: 1.3,
        minRegionArea: 8,
        mergeRegionArea: 20,
        maxVertsPerPoly: 6,
        detailSampleDist: 6,
        detailSampleMaxError: .1,
        };
        console.time('createZone()');
        navigationPlugin.createNavM([maze], navmeshParameters)
        
        console.timeEnd('createZone()');
        var navMeshData = navigationPlugin.createDebugNavyMesh(scene)
        
         var geometry = new THREE.Geometry().fromBufferGeometry(navMeshData.geometry)
              for (i = 0; i < geometry.faces.length ; i++) {
         geometry.faceVertexUvs[0].push([
           new THREE.Vector2( Math.random(), Math.random() ),
           new THREE.Vector2( Math.random(), Math.random() ),
           new THREE.Vector2( Math.random(), Math.random() ),
           ]);
          }
          
          var grasstexture = textureLoader.load('https://cdn.glitch.com/e1f07ec4-c6d7-451f-9b46-e49295350009%2Fd3byyeg-c060198a-c568-43c3-ad0a-43f0035e4e44.jpg?v=1571674609254')
           grasstexture.wrapS = THREE.RepeatWrapping;
           grasstexture.wrapT = THREE.RepeatWrapping;
           grasstexture.repeat.set( .4, .4 );
        
          var navMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"green", map: grasstexture, side: THREE.DoubleSide}))
          scene.add(navMesh)
          navMeshes.push(navMesh)
       
      },
      createCrowd: function(n, pos, func){
       // var crowd = this.crowd
        var navigationPlugin = this.navigationPlugin
        var scene = this.scene
        var agentsMesh = this.agentsMesh
        var player_transforms = this.player_transforms
        var crowd = navigationPlugin.createCrowd(1, 0.1);
        var i;
        var agentParams = {
            radius: 0.1,
            height: 0.2,
            maxAcceleration: (func === "player")? 4.0*2: 4.0,
            maxSpeed: (func === "player")? 1.0*2: 1.0,
            collisionQueryRange: 0.5,
            pathOptimizationRange: 0.0,
            separationWeight: 3.0
        };

        for (i = 0; i <n; i++) {
            var width = 0.20;
            var agentCube = new THREE.Mesh(new THREE.BoxBufferGeometry(.2, .2, .2), new THREE.MeshBasicMaterial({color:"red", transparent: true, opacity: 0.0}))
            scene.add(agentCube)
            var variation = Math.random();
            var randomPos = navigationPlugin.getRandomPointAround(pos, 0.5);
            transform = new THREE.Object3D();
            scene.add(transform)
            agentCube.parent = transform;           
            transform.add(agentCube)
            if(func === "enemy")agentsMesh.push(agentCube);
            if(func === "player")player_transforms.push(agentCube);
            var agentIndex = crowd.addAgent(randomPos, agentParams, transform);
        }
        return crowd
      },
      loadAnimatedMesh: function(){
        var loader = this.assetloader
        var scene = this.scene
        var agentsMesh = this.agentsMesh
        var mixers = this.mixers;
        var scale = .6
        var url = "https://cdn.glitch.com/6a20197d-4cad-4fc5-bd27-537460ea1cdb%2Fzombata.gltf?v=1571074383527"
        loader.load(url, function (data) {
        gltf = data;
        var object;
        if ( gltf.scene !== undefined ) {
            object = gltf.scene; // default scene
        } else if ( gltf.scenes.length > 0 ) {
            object = gltf.scenes[0]; // other scene
        }
        object.scale.set(scale, scale, scale);
        var animations = gltf.animations;
         THREE.ImageUtils.crossOrigin = '';
         //var texture = THREE.ImageUtils.loadTexture('https://cdn.glitch.com/ce192d96-fb1a-4b23-8d96-dd1e3d4c6629%2Fd3gbkkz-51c08bcc-4512-4a24-954c-1b4bdaeb84ca.png?1558285245388');
         data.scene.traverse((child) => {

           
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //console.log(child.material)
                if (child.material.type = "MeshStandardMaterial") {
                    child.material.dispose();
                    scene.remove(child.material)
          
                    child.material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color("red").multiplyScalar(10),
                        map: child.material.map,
                        morphTargets: true
                      
                    });
                    
                    }
                    
                    }
                    })
         // scene.add(object)
          var mixer = new THREE.AnimationMixer(object);
          var animation = AnimationUtils.subclip(animations[0], 'idle', 1, 25);
          mixer.clipAction(animation).play();
          mixers.push(mixer)
          for(var i = 0; i<agentsMesh.length; i++){
          var clone = object.clone()
          scene.add(clone)
          clone.parent = agentsMesh[i]
          agentsMesh[i].add(clone)
          
            var mixer = new THREE.AnimationMixer(clone);
          mixer.clipAction(animation).play();
          mixers.push(mixer)
            
          }
     
          
        })
                    
      },
      loadPlayer: function(){
        //2.145185227016347, y: 0.009999983012676239, z: -0.7995015133270902
        var scene = this.scene
        var player = this.player
        var player_transforms = this.player_transforms                     
        var texture_rodent = textureLoader.load( 'https://cdn.glitch.com/ca440387-5ef4-4401-a707-6a988d4e8bc5%2FDownload-Rat-PNG-Transparent-Image-362.png?v=1572048386569' );                                          
        var playerMaterials = [                                                      
        new THREE.MeshBasicMaterial( { transparent: true, opacity: 0} ),                      
        new THREE.MeshBasicMaterial( { transparent: true, opacity: 0} ),                      
        new THREE.MeshBasicMaterial( { transparent: true, opacity: 0} ),                      
        new THREE.MeshBasicMaterial( { transparent: true, opacity: 0} ),                      
        new THREE.MeshBasicMaterial( { map: texture_rodent, transparent: true } ),                      
        new THREE.MeshBasicMaterial( { transparent: true, opacity: 0} )                      
        ];
        var player = new THREE.Mesh(new THREE.BoxBufferGeometry(.2, .2, .2), playerMaterials)//new THREE.MeshBasicMaterial({map: textureLoader.load(''), transparent: true, side: THREE.FrontSide}))
        player.rotation.x = -Math.PI/2
        scene.add(player)
        player.parent = player_transforms[0]
        player_transforms[0].add(player)
        
      },
      createUI: function(messageBox){
      var scene = this.scene
      var camera = this.camera
      var score = this.score
      var width = window.innerWidth;
      var height = window.innerHeight;
    
      var hudCanvas = document.createElement('canvas');
      hudCanvas.width = width;
      hudCanvas.height = height;
      var hudBitmap = hudCanvas.getContext('2d');
      hudBitmap.font = "Normal 40px Chalkduster";
      hudBitmap.textAlign = 'center';
      hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
      hudBitmap.fillRect(0, 0, window.width, window.height);
      if(messageBox)hudBitmap.fillStyle = "rgba(245,0,0,0.75)";
      
      if(messageBox)hudBitmap.fillText('Game Over!! You were eaten!', width / 2, height / 2), SIMWORLD.messageMap = hudBitmap;
      else hudBitmap.fillText('Score: '+parseInt(localStorage.getItem('hscore')), width / 2, height / 2), SIMWORLD.scoreMap = hudBitmap;
      var hudTexture = new THREE.Texture(hudCanvas) 
      hudTexture.needsUpdate = true;

      // Create HUD material.
      var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
      material.transparent = true;
      // Create plane to render the HUD. This plane fill the whole screen.
      var planeGeometry = new THREE.PlaneGeometry( width, height );
      var plane = new THREE.Mesh( planeGeometry, material );
      scene.add( plane );
      if(messageBox)plane.scale.set(.003, .003, .003)
      else plane.scale.set(.001, .001, .001)
      
      plane.parent = camera
      camera.add(plane)
      if(!messageBox)plane.position.y = .3
      if(!messageBox)plane.position.x = .4
      plane.position.z = -1
      return plane
        
      },
      checkIntersection: function(object1, object2) {
        //check intersection with simple aabb collision
        object1.geometry.computeBoundingBox(); //not needed if its already calculated
        object2.geometry.computeBoundingBox();

        object1.updateMatrixWorld();
        object2.updateMatrixWorld();
        var box1 = object1.geometry.boundingBox.clone();
        box1.applyMatrix4(object1.matrixWorld);

        var box2 = object2.geometry.boundingBox.clone();
        box2.applyMatrix4(object2.matrixWorld);

        return box1.intersectsBox(box2);

    },
      playAgain: function(){
      var scene = this.scene
      var renderer = this.renderer
      var navigationPlugin = this.navigationPlugin
      var crowd = this.crowd
      var player = this.player
      console.log(scene.children)
      if(renderer.domElement)document.body.removeChild( renderer.domElement );
      delete renderer
      renderer = undefined
      navigationPlugin.dispose();
      crowd.dispose();
      player.dispose();
      scene.remove.apply(scene, scene.children);

      },
      onDocumentMouseUp: function(event) {
      var pathLines = SIMWORLD.pathLines
      var mouse = SIMWORLD.mouse
      var camera = SIMWORLD.camera
      var raycaster = SIMWORLD.raycaster
      var navMeshes = SIMWORLD.navMeshes
      var crowd = SIMWORLD.player
      var navigationPlugin = SIMWORLD.navigationPlugin
      var pathLines = SIMWORLD.pathLines
      var col = this.collided
      var scene = SIMWORLD.scene
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			camera.updateMatrixWorld();
			raycaster.setFromCamera( mouse, camera );
			const intersects = raycaster.intersectObjects( navMeshes );
      
			if ( !intersects.length) return;
      startingPoint = intersects[0].point;
        //console.log(startingPoint)
      if (startingPoint && crowd) { // we need to disconnect camera from canvas
       
                var agents = crowd.getAgents();
                var i;
                for (i=0;i<agents.length;i++) {
                    var randomPos = navigationPlugin.getRandomPointAround(startingPoint, 1.0);
                    crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(startingPoint));
                }
                var pathPoints = navigationPlugin.computePath(crowd.getAgentPosition(agents[0]), navigationPlugin.getClosestPoint(startingPoint));
                if (pathPoints && pathPoints.length) {
              
            }
        
        }
  
      },
      pursuePlayer: function(player_pos){
      //  console.log("player pursued!")
      var crowd = SIMWORLD.crowd
      var navigationPlugin = SIMWORLD.navigationPlugin
      var startingPoint = player_pos;
      //console.log(startingPoint)
      if (startingPoint && crowd) { // we need to disconnect camera from canvas
       
                var agents = crowd.getAgents();
                var i;
                for (i=0;i<agents.length;i++) {
                    var randomPos = navigationPlugin.getRandomPointAround(startingPoint, 1.0);
                    crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(startingPoint));
                }
                var pathPoints = navigationPlugin.computePath(crowd.getAgentPosition(agents[0]), navigationPlugin.getClosestPoint(startingPoint));
                if (pathPoints && pathPoints.length) {
              
            }
        
        }
      },
       animate: function() {

        requestAnimationFrame(this.animate.bind(this));
        var scene = this.scene
        var renderer = this.renderer
        var camera = this.camera
        var crowd = this.crowd
        var player = this.player
        var clock = this.clock
        var agentsMesh = this.agentsMesh
        var player_transforms = this.player_transforms
        var enem_dir = this.enem_dir
        var player_dir = this.player_dir
        var agentPos = this.agentPos
        var playerPos = this.playerPos
        var alpha = this.alpha
        var mixers = this.mixers
        var stats = this.stats
       // var col = this.collided
        //var collision_frequency = this.collision_frequency
        
        
        alpha = (Math.random() * (.02 - .005)) + .005;
        if (mixers.length != 0) {
            for (var i = 0; i < mixers.length; i++) {
                mixers[i].update(alpha);
            }
        }
        if(crowd){
        crowd.update(clock.getDelta())
         for(var i = 0; i<agentsMesh.length; i++){
          enem_dir = agentsMesh[i].parent.position.clone()
          agentsMesh[i].getWorldPosition( agentPos );
          agentsMesh[i].rotation.y = Math.atan2(enem_dir.x - agentPos.x, enem_dir.z - agentPos.z)
          
          
  
          }
        }
         this.collision_frequency += 1
         if(player){
           player.update(alpha)
           //console.log(this.collision_frequency)
           player_transforms[0].getWorldPosition( playerPos );
           player_dir = player_transforms[0].parent.position.clone()
           player_transforms[0].rotation.y = Math.atan2(player_dir.x - playerPos.x, player_dir.z - playerPos.z)
           camera.position.x = parseFloat(playerPos.x+1)
           camera.position.z = parseFloat(playerPos.z+1)
           
           if(this.collision_frequency >= 4){
           this.collision_frequency = 0
           var dist = agentsMesh[0].parent.position.distanceTo(player_transforms[0].parent.position)
           //console.log(dist)
           //check collision between player and fruits
           for(var i = 0; i<this.fruitsInv.length; i++){
             if(SIMWORLD.checkIntersection(this.fruitsInv[i], player_transforms[0])){
               this.fruitsInv[i].position.x = 1000000
               scene.remove(this.fruitsInv[i])
               scene.remove(this.fruitsInv[i].geometry)
               this.score++
               if(this.score >= this.fruitsInv.length){
                 console.log("%cWinner!", 'color: blue')
                 this.messageMap.clearRect(0, 0, this.messageMap.canvas.width, this.messageMap.canvas.height);
                 this.messageMap.fillText('Winner!!', window.innerWidth/2, window.innerHeight/2)
                 this.messageBoard.material.map.needsUpdate = true;
                 this.messageBoard.position.y = .1
                 this.refreshTimeout++
                 this.scoreMap.clearRect(0, 0, this.scoreMap.canvas.width, this.scoreMap.canvas.height);
                 if(parseInt(localStorage.getItem('hscore')) != null)this.score += parseInt(localStorage.getItem('hscore'));
                 localStorage.setItem('hscore', this.score);
                 //setTimeout(window.location.reload(true), 6000);
                // alert("you won!")
                 SIMWORLD.playAgain()
                 
               }else{
                 this.messageBoard.position.y = 100.0;
               }
               
               this.scoreMap.clearRect(0, 0, this.scoreMap.canvas.width, this.scoreMap.canvas.height);
               var newscore = parseInt(localStorage.getItem('hscore'))+this.score
               if(parseInt(localStorage.getItem('hscore')) != this.score)this.scoreMap.fillText('Score: '+newscore, window.innerWidth/2, window.innerHeight/2)
               this.scoreBoard.material.map.needsUpdate = true;            
             }
           }
           
           //check collision between zombie and player
           this.collided = SIMWORLD.checkIntersection(agentsMesh[0], player_transforms[0])
          
           if(this.collided){
            /*this.messageBoard.position.y = .1
            localStorage.setItem('hscore', 0);
            this.collided = false
            document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
            //alert("you were eaten!")
            //window.location.reload(true)
           */
            
           }else{
            this.messageBoard.position.y = 100
      
           }
           }
           //SIMWORLD.pursuePlayer(playerPos)
         }
         stats.update()
        renderer.render(scene, camera);
        }
    
    }
    
    window.onload = function(){
      SIMWORLD.Initialize()
      SIMWORLD.loadPlayer()
      SIMWORLD.loadAnimatedMesh()
      SIMWORLD.animate()
    }
    </script>
  </body>
</html>

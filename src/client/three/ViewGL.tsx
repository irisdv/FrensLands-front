import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class ViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  //private mapWidth: number;
  //private mapLength: number;

  // Camera
  private camera: THREE.PerspectiveCamera;
  private camX: number;
  private camY: number;
  private camZ: number;

  private clock: THREE.Clock;
  private controls: any;
  private stats: any;

  private mouse: THREE.Vector2;

  private compArray: any[];
  private frontBlockArray: any[];
  private validatedBlockArray: any[];

  private firstLoad: number;

  constructor(canvasRef: any) {
    // CREATE SCENE AND RENDERER
    this.scene = new THREE.Scene();
    this.mouse = new THREE.Vector2;

    this.firstLoad = 1;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.clock = new THREE.Clock();

    const skyColor = 0xfff9e8;
    this.scene.background = new THREE.Color(0x64a8d1);

    // ADD LIGHT & FOG
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    var light = new THREE.DirectionalLight(0xffffff, 0.35);
    light.position.set(12, 12, 8);
    this.scene.add(light);

    // CAMERA
    this.camX = 0;
    this.camY = 10;
    this.camZ = 0;
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.y = this.camY;
    this.camera.position.z = this.camZ;
    this.controls = new OrbitControls(this.camera, canvasRef);


    // ******************* INIT ARRAYS ************************//
    var i = 0;
    this.compArray = [];
    while (i < 640)
    {
      this.compArray[i] = "1234567891234567";
      i++;
    }

    this.frontBlockArray = [];
    this.validatedBlockArray = [];

    var indexI = 0;
    var indexJ = 0;
    i = 0;

    while (indexI < 16)
    {
      this.validatedBlockArray[indexI] = [];
      this.frontBlockArray[indexI] = [];

      while (indexJ < 40)
      {
        this.validatedBlockArray[indexI][indexJ] = decompose(this.compArray[i]);

        if (this.firstLoad == 1)
        {
          this.frontBlockArray[indexI][indexJ] = decompose(this.compArray[i]);
        }
        indexJ++;
        i++;
      }
      indexJ = 0;
      indexI++;
    }

    this.firstLoad = 0;


    function decompose(elem: any)
    {
      var tempDecomp : any[] = [];
      elem.toString()

      tempDecomp[0] = elem[0] + elem[1];            //[pos:x]
      tempDecomp[1] = elem[2] + elem[3];            //[pos:y]
      tempDecomp[2] = elem[4];                      //[mat type]
      tempDecomp[3] = elem[5] + elem[6];            //[ress or bat type]
      tempDecomp[4] = elem[7] + elem[8] + elem[9];  //[UNIQUE ID]
      tempDecomp[5] = elem[10] + elem[11];          //[health]
      tempDecomp[6] = elem[12] + elem[13];          //[quantity ress or pop]
      tempDecomp[7] = elem[14];                     //[current level
      tempDecomp[8] = elem[15];                     //[activity index or number of days active]


      console.log("tempDecomp", tempDecomp);

      return (tempDecomp);

    }
      //tempDecomp[9] = objet3d


    // ******************* GET WORLD READY *******************//
    this.terrainCreate();

    // CALL ANIMATION LOOP
    this.update();
  }
  // ****************** FUNCTIONS ********************** //

  terrainCreate = () => {
    var terrain: THREE.Mesh;
    let terrainPlane = new THREE.PlaneGeometry(40, 16, 1, 1);
    terrainPlane.rotateX(-Math.PI * 0.5);
    const texture = new THREE.TextureLoader().load(
      "resources/textures/Grass_Gen1.png"
    );

    let mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    if (mat.map) {
      mat.map.repeat = new THREE.Vector2(1, 1); // TEXTURE TILLING
      mat.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      mat.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      mat.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }

    terrain = new THREE.Mesh(terrainPlane, mat);
    this.scene.add(terrain);
  };

  // ******************* PUBLIC EVENTS ******************* //
  onWindowResize = (vpW: number, vpH: number) => {
    this.camera.aspect = vpW / vpH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(vpW, vpH);

    // this.camera.aspect = window.innerWidth / window.innerHeight;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize( window.innerWidth, window.innerHeight );
  };

  onDocumentMouseDown = (event: any) => {
    // mousePressed = true;
    console.log("mousePressed", true);
  };

  onDocumentMouseUp = (event: any) => {
    // mousePressed = false; syncframe = 0;
    console.log("mousePressed", false);
  };

  onDocumentMouseMove = (event: any) => {

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    //console.log ("mouseX", this.mouse.x);
    //console.log ("mouseY", this.mouse.y);

    //   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster.setFromCamera( mouse.clone(), camera );
    //console.log("mouseMoved X", (event.clientX / window.innerWidth) * 2 - 1);
  };

  // ******************* TEST TO CLEAN LATER ******************//

  /*
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  }

  function onWindowResize()
  {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function onDocumentMouseDown( event ) { mousePressed = true; }
  function onDocumentMouseUp( event ) { mousePressed = false; syncframe = 0; }
  function onDocumentMouseMove( event )
  {

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse.clone(), camera );

}*/

  // ******************* RENDER LOOP ******************* //
  update = (t?: any) => {
    // cam
    this.controls.target = new THREE.Vector3(
      this.camera.position.x,
      0,
      this.camera.position.z
    );

    this.controls.update();

    // this.stats.update();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.update.bind(this));
  };
}

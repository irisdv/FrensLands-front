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

  constructor(canvasRef: any)
  {
    // CREATE SCENE AND RENDERER
    this.scene = new THREE.Scene();

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
    this.camX = 0
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

    // ******************* GET WORLD READY *******************//
    this.terrainCreate();


    // CALL ANIMATION LOOP
    this.update();
  }
  // ****************** FUNCTIONS ********************** //

  terrainCreate = () =>
  {
    var terrain: THREE.Mesh;
    let terrainPlane = new THREE.PlaneGeometry(40, 16, 1, 1);
    terrainPlane.rotateX(-Math.PI * 0.5);
    const texture = new THREE.TextureLoader().load('resources/textures/Grass_Gen1.png');

    let mat = new THREE.MeshStandardMaterial(
    {
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    if(mat.map)
    {
        mat.map.repeat = new THREE.Vector2(1, 1); // TEXTURE TILLING
        mat.map.wrapS = THREE.RepeatWrapping; // REPEAT X
        mat.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
        mat.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }

    terrain = new THREE.Mesh(terrainPlane, mat);
    this.scene.add(terrain);
  }

  // ******************* PUBLIC EVENTS ******************* //
  onWindowResize = (vpW: number, vpH: number) => {
    this.camera.aspect = vpW / vpH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(vpW, vpH);
  };


  // ******************* RENDER LOOP ******************* //
  update = (t?: any) => {



    // cam
    this.controls.target = new THREE.Vector3(0, 0, 0);


    this.controls.update();

    // this.stats.update();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.update.bind(this));
  };
}

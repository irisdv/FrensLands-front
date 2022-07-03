import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class ViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private mapWidth: number;
  private mapLength: number;

  // Camera
  private camera: THREE.PerspectiveCamera;
  private camY: number;
  private camZ: number;

  private clock: THREE.Clock;
  private controls: any;
  private stats: any;

  constructor(canvasRef: any) {
    this.mapLength = 1000;
    this.mapWidth = 1000;

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
    this.camY = 85;
    this.camZ = 65;
    this.camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.y = this.camY;
    this.camera.position.z = this.camZ;
    this.controls = new OrbitControls(this.camera, canvasRef);

    // CALL ANIMATION LOOP
    this.update();
  }

  // ******************* PUBLIC EVENTS ******************* //
  onWindowResize = (vpW: number, vpH: number) => {
    this.camera.aspect = vpW / vpH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(vpW, vpH);
  };

  // ******************* RENDER LOOP ******************* //
  update = (t?: any) => {
    this.controls.update();

    // this.stats.update();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.update.bind(this));
  };
}

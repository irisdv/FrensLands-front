import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

export default class ViewGL
{
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  // Camera
  private camera: THREE.PerspectiveCamera;
  private camX: number;
  private camY: number;
  private camZ: number;

  private clock: THREE.Clock;
  private controls: any;
  private stats: any;

  private terrain = new THREE.Mesh;

  private mouse: THREE.Vector2;
  private mousePressed: number;
  private mouseMove: THREE.Vector2;
  private tempMousePos: THREE.Vector2;
  private mouseWheel: number;

  private raycaster = new THREE.Raycaster();

  private compArray: any[];
  private frontBlockArray: any[];
  private validatedBlockArray: any[];

  private firstLoad: number;

  private keyMap: any = [];

  constructor(canvasRef: any)
  {
    // CREATE SCENE AND RENDERER
    this.scene = new THREE.Scene();
    this.scene.name = "theScene";
    this.mouse = new THREE.Vector2;
    this.mousePressed = 0;
    this.mouseWheel = 0;
    this.mouseMove = new THREE.Vector2;
    this.tempMousePos = new THREE.Vector2;
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
    this.camX = 21;
    this.camY = 150;
    this.camZ = 9;
    this.camera = new THREE.PerspectiveCamera(
      5,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.x = this.camX;
    this.camera.position.y = this.camY;
    this.camera.position.z = this.camZ;
    this.camera.rotateX(-Math.PI * 0.5);



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

    // ********************** FUNCTIONS IN CONSTRUCTOR ************************//

    // DECOMPOSE THE ARRAY OF DATA PER ELEMENT
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

      //tempDecomp[9] = objet3d

      console.log("tempDecomp", tempDecomp);

      return (tempDecomp);
    }


    // ******************* GET WORLD READY *******************//

    // CREATE TERRAIN
    this.terrainCreate();

    var testPos = new THREE.Vector2(24, 7);

    this.createObject(testPos, 2, 1, "youpi",1 , 1, "Matchbox_Tiles_Objects_Outlined");

    // CALL ANIMATION LOOP
    this.update();
  }

  // ****************** FUNCTIONS OUT OF CONSTRUCTOR ********************** //

  // CREATE THE TERRAIN
  terrainCreate = () =>
  {
      let terrainPlane = new THREE.PlaneGeometry(40, 16, 1, 1);
      terrainPlane.name = "terrainGeometry";
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

      if (mat.map)
      {
        mat.map.repeat = new THREE.Vector2(1, 1); // TEXTURE TILLING
        mat.map.wrapS = THREE.RepeatWrapping; // REPEAT X
        mat.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
        mat.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
      }

      this.terrain = new THREE.Mesh(terrainPlane, mat);
      this.terrain.name = "terrainMesh";
      this.terrain.position.x = 21;
      this.terrain.position.z = 9;
      this.scene.add(this.terrain);
    };


  // CAMERA MOUSE CONTROL
  mouseControls = () =>
  {

    if (this.mousePressed == 1)
    {
      this.mouseMove.x = 0;
      this.mouseMove.y = 0;

      var difX = (this.tempMousePos.x - this.mouse.x) * 100;
      var difY = (this.tempMousePos.y - this.mouse.y) * 100;

      if (difX < 0)
      {
        difX = difX * -1;
      }
      if (difY < 0)
      {
        difY = difY * -1;
      }

      if (this.tempMousePos.x < this.mouse.x)
      {
        if (this.camera.position.x > 0)
        {
          this.mouseMove.x = 0.1 * difX;
          this.camera.position.x -= this.mouseMove.x;
        }
      }
      else if (this.tempMousePos.x > this.mouse.x)
      {
        if (this.camera.position.x < 40)
        {
          this.mouseMove.x = 0.1 * difX;
          this.camera.position.x += this.mouseMove.x;
        }
      }
      else if (this.tempMousePos.x == this.mouse.x)
      {
        this.mouseMove.x = 0;
      }

      if (this.tempMousePos.y < this.mouse.y)
      {
        if (this.camera.position.z < 16)
        {
          this.mouseMove.y = 0.1 * difY;
          this.camera.position.z += this.mouseMove.y;
        }
      }
      else if (this.tempMousePos.y > this.mouse.y)
      {
        if (this.camera.position.z > 0)
        {
          this.mouseMove.y = 0.1 * difY;
          this.camera.position.z -= this.mouseMove.y;
        }
      }
      else if (this.tempMousePos.y == this.mouse.y)
      {
        this.mouseMove.y = 0;
      }
    }

    this.tempMousePos.x = this.mouse.x;
    this.tempMousePos.y = this.mouse.y;
  }

  // RAYCASTING
  rayCast = () =>
  {
    // TO RAYCAST ONLY TERRAIN
    //var objects = [];
    //objects[0] = this.terrain;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    var currRayPos = new THREE.Vector3;
    var tempInter : any[] = [];
    var tempInterY : any[] = [];
    var i = 0;
    var k = 0;
    var j = 0;

    while (i < intersects.length)
    {
      if (intersects[i].point.y > -1 && intersects[i].point.x > 1 && intersects[i].point.z > 1)
      {
        //console.log("intersects", intersects[i].object);
        tempInter[k] = intersects[i].point;
        tempInterY[k] = intersects[i].point.y;
        k++;
      }
      i++;
  	}

    tempInterY.sort(function(a, b){return a - b});

    while (j < k)
    {
      if (tempInter[j] != null && tempInterY != null && tempInterY[0] == tempInter[j].y)
      {
        currRayPos = tempInter[j];
        break;
      }
      j++;
    }
    if (currRayPos != null)
    {
      console.log("currRayPosX", parseInt((currRayPos.x).toFixed(2)));
      //console.log("currRayPosX", (currRayPos.x).toFixed(2));
      console.log("currRayPosY", parseInt((currRayPos.z).toFixed(2)));
      //console.log("currRayPosY", (currRayPos.z).toFixed(2));
    }
  }

  // CREATE GEOMETRY AND MESH ON TERRAIN
  createObject = (pos : THREE.Vector2, sizeX : number, sizeY : number, name : String,
    type : number, progress : number, nameText : String) =>
  {

    let newObject = new THREE.PlaneGeometry(sizeX, sizeY, 1, 1);
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    const textObj = new THREE.TextureLoader().load(
      "resources/textures/"+ nameText +".png"
    );

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(1, 1); // TEXTURE TILLING
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name + "_mesh";
    newObjectMesh.position.x = pos.x + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y + 0.5;
    this.scene.add(newObjectMesh);
  }

  // REPLACE GEOMETRY AND MESH ON TERRAIN
  replaceObject = (pos : THREE.Vector2, sizeX : number, sizeY : number, name : String,
    type : number, progress : number, nameText : String) =>
  {


    //call delete function

    let newObject = new THREE.PlaneGeometry(sizeX, sizeY, 1, 1);
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    const textObj = new THREE.TextureLoader().load(
      "resources/textures/"+ nameText +".png"
    );

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(1, 1); // TEXTURE TILLING
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name + "_mesh";
    newObjectMesh.position.x = pos.x + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y + 0.5;
    this.scene.add(newObjectMesh);
  }

  // DELETE FORMER OBJECT IN SCENE USING NAME OR POS
  deleteObject = (name : string) =>
  {
    this.scene.remove(this.scene.getObjectByName(name) as THREE.Group)
    console.log("This object has been deleted : ", name);
  }

  // ******************* PUBLIC EVENTS ******************* //

  onWindowResize = (vpW: number, vpH: number) =>
  {
    this.camera.aspect = vpW / vpH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(vpW, vpH);
  };

  onDocumentMouseDown = (event: any) =>
  {
    console.log("mousePressed", true);
    this.mousePressed = 1;
  };

  onDocumentMouseUp = (event: any) =>
  {
    console.log("mousePressed", false);
    this.mousePressed = 0;
  };

  onMouseWheel = (event: any) =>
  {

    if (event.deltaY > 0)
    {
        this.mouseWheel = -1;
        if (this.camera.position.y > 45)
        {
          this.camera.position.y -= 15;
          this.deleteObject("youpi");
        }
    }
    else if (event.deltaY < 0)
    {
        this.mouseWheel = 1;
        if (this.camera.position.y < 180)
        {
          this.camera.position.y += 15;
        }
    }
    else
    {
        this.mouseWheel = 0;
    }
    console.log("eventWheel", this.mouseWheel);
  }

  onDocumentKeyDown = (event: any) =>
  {
      var keyCode = event.code;
      this.keyMap[keyCode] = true;
  }

  onDocumentKeyUp = (event: any) =>
  {
      var keyCode = event.code;
      this.keyMap[keyCode] = false;
  }

  onDocumentMouseMove = (event: any) =>
  {
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  };

  // ******************* TEST TO CLEAN LATER ******************//




  // ******************* RENDER LOOP ******************* //

  update = (t?: any) =>
  {

    this.mouseControls();

    this.rayCast();

    // this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.update.bind(this));

  };
}

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
  private textArrRef: any[];
  private tempBuildMesh = new THREE.Mesh;
  private tempBuildMeshSize: number = 0;
  private tempBuildMeshType: number = 0;
  private tempBuildMeshProgress: number = 0;
  private tempBuildMeshName: number = 0;
  private tempBuildMeshTextName = "";
  private tempBuildMeshUpdate: number = 0;
  private placementActive: number = 0;

  private mouse: THREE.Vector2;
  private mouseRightPressed: number;
  private mouseLeftPressed: number;
  private mouseMiddlePressed: number;
  private mouseMove: THREE.Vector2;
  private tempMousePos: THREE.Vector2;
  private mouseWheel: number;

  private raycaster = new THREE.Raycaster();
  private currRayPos = new THREE.Vector3;
  private currBlockPos = new THREE.Vector2;

  private greenText = "Matchbox_Tiles_Objects_GreenVersion";
  private redText = "Matchbox_Tiles_Objects_RedVersion";
  private normalText = "Matchbox_Tiles_Objects";
  private outlinedText = "Matchbox_Tiles_Objects_Outlined";

  private compArray: any[];
  private frontBlockArray: any[];
  private validatedBlockArray: any[];

  private firstLoad: number;

  private keyMap: any = [];

  private UbuildingIDs: number = 0;

  private timeClick = 1;
  private tempTime = Date.now();


  // *********************** DEBUG/TEST *********************** //

  private debugMode = 2;


  // *********************** DEBUG/TEST *********************** //


  constructor(canvasRef: any)
  {
    // CREATE SCENE AND RENDERER
    this.scene = new THREE.Scene();
    this.scene.name = "theScene";
    this.mouse = new THREE.Vector2;
    this.mouseRightPressed = 0;
    this.mouseLeftPressed = 0;
    this.mouseMiddlePressed = 0;
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


    // INIT TEXT REF ARRAYS
    this.textArrRef = [];


    // INIT ARRAY OF DATA [RECEIVED FROM BC]
    var i = 0;
    this.compArray = [];
    while (i < 640)
    {
      //this.compArray[i] = "1234567891234567"; //TEST FULL BLOCKS
      this.compArray[i] = "1234500891234567"; //TEST EMPTY BLOCKS
      i++;
    }

    this.frontBlockArray = [];
    this.validatedBlockArray = [];

    var indexI = 1;
    var indexJ = 1;
    i = 0;

    while (indexI < 17)
    {
      this.validatedBlockArray[indexI] = [];
      this.frontBlockArray[indexI] = [];

      while (indexJ < 41)
      {
        this.validatedBlockArray[indexI][indexJ] = this.decompose(this.compArray[i]);

        if (this.firstLoad == 1)
        {
          this.frontBlockArray[indexI][indexJ] = this.decompose(this.compArray[i]);
        }
        indexJ++;
        i++;
      }
      indexJ = 1;
      indexI++;
    }

    this.firstLoad = 0;

    // ******************* GET WORLD READY *******************//

    // CREATE TERRAIN
    this.terrainCreate();

    // CALL ANIMATION LOOP
    this.update();
  }

  // ****************** FUNCTIONS OUT OF CONSTRUCTOR ********************** //

  // DECOMPOSE THE ARRAY OF DATA PER ELEMENT
  decompose = (elem: any) =>
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

    this.debugPrint(1, "tempDecomp", tempDecomp);

    return (tempDecomp);
  }

  debugPrint = (type: number, string: String, varToPrint?: any) =>
  {
    if (this.debugMode == 2)
    {
      if (type == 2 || type == 1)
      {
        if (varToPrint != null)
        {
          console.log(string, varToPrint);
        }
        else
        {
          console.log(string);
        }
      }
    }
    else if (this.debugMode == 1)
    {
      if (type == 1)
      {
        if (varToPrint != null)
        {
          console.log(string, varToPrint);
        }
        else
        {
          console.log(string);
        }
      }
    }
  }


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

    if (this.mouseRightPressed == 1)
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
    const intersects = this.raycaster.intersectObjects(this.scene.children, true); // RAYCAST ALL SCENE
    //const intersects = this.raycaster.intersectObjects(objects, true); // RAYCAST ONLY TERRAIN
    var tempRayPos = new THREE.Vector3;
    var tempInter : any[] = [];
    var tempInterY : any[] = [];
    var i = 0;
    var k = 0;
    var j = 0;

    while (i < intersects.length)
    {
      if (intersects[i].point.y > -1 && intersects[i].point.x > 1 && intersects[i].point.z > 1)
      {
        //this.debugPrint(1, "intersects", intersects[i].object);
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
        tempRayPos = tempInter[j];
        break;
      }
      j++;
    }
    if (tempRayPos != null)
    {
      this.currBlockPos.x = parseInt((tempRayPos.x).toFixed(2));
      this.currBlockPos.y = parseInt((tempRayPos.z).toFixed(2));
      this.currRayPos = tempRayPos;
      this.debugPrint(2, "currRayPosX", parseInt((tempRayPos.x).toFixed(2)));
      this.debugPrint(2, "currRayPosY", parseInt((tempRayPos.z).toFixed(2)));
      //this.debugPrint(2, "currBlockPos", this.currBlockPos);
    }
  }

  checkFree = (pos : THREE.Vector2, numB : number) =>
  {
    if (pos.x >= 1 && pos.x <= 40 && pos.y >= 1 && pos.y <= 16 && pos.y - 1 != 0)
    {
      if (numB == 1)
      {
        if (this.frontBlockArray[pos.y][pos.x][3] != null && this.frontBlockArray[pos.y][pos.x][3] == 0)
        {
          this.debugPrint(2, "A");
          return (1);
        }
      }
      else if (numB == 2)
      {
        if (this.frontBlockArray[pos.y][pos.x][3] != null && this.frontBlockArray[pos.y][pos.x][3] == 0
          && this.frontBlockArray[pos.y][pos.x + 1] != null && this.frontBlockArray[pos.y][pos.x + 1][3] == 0)
        {
          this.debugPrint(2, "B");
          return (1);
        }
      }
      else if (numB == 4)
      {
        if (this.frontBlockArray[pos.y][pos.x] != null && this.frontBlockArray[pos.y][pos.x][3] == 0
          && this.frontBlockArray[pos.y][pos.x + 1] != null && this.frontBlockArray[pos.y][pos.x + 1][3] == 0
          && this.frontBlockArray[pos.y - 1][pos.x] != null && this.frontBlockArray[pos.y - 1][pos.x][3] == 0
          && this.frontBlockArray[pos.y - 1][pos.x + 1] != null && this.frontBlockArray[pos.y - 1][pos.x + 1][3] == 0
        )
        {
          this.debugPrint(2, "C");
          return (1);
        }

      }
    }
    this.debugPrint(2, "D");
    return (0);
  }

  findTextByID = (type : number) => // NEED TO FINISH IT WHEN TEXTARRREF IS DONE
  {
    var posText = new THREE.Vector2;

    posText.x = (this.textArrRef[type].x * (1 / 16));
    posText.y = (this.textArrRef[type].y * (1 / 16));

    return (posText);
  }


  // CREATE TEMPORARY BUILDING THAT FOLLOWS CURSOR AND CHANGES COLOR BASED ON POSSIBLE
  // SPACE OR NOT + GETS DELETE IF SPACE FOUND AND ACTIVATED OR CREATION CANCELED
  createObject_FindSpace = (size : number, name : number,
    type : number, progress : number, nameText : String) =>
  {

    let newObject = new THREE.PlaneGeometry;
    if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {
      newObject = new THREE.PlaneGeometry(2, 2, 1, 1);
    }
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
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set(0.00, 0.00); // POSITION OF BUILDING ON TEXTURE
      matObj.map.offset.set((4 * (1 / 16)), (4 * (1 / 16)));
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }

    // NEED TO STORE DATE WHEN TEMP BUILDING IS DELETED TO CHANGE TEXTURE
    this.tempBuildMeshType = type;
    this.tempBuildMeshProgress = progress;
    this.tempBuildMeshTextName = nameText.toString();
    this.tempBuildMeshSize = size;
    this.tempBuildMeshName = name;
    //this.tempBuildMesh = null;
    this.tempBuildMeshUpdate = 1;
    this.debugPrint(2, "E_CREATE_TEMPFINDSPACE_FUNC");

    this.tempBuildMesh = new THREE.Mesh(newObject, matObj);
    this.tempBuildMesh.name = name.toString();
    this.tempBuildMesh.position.x = this.currBlockPos.x;
    this.tempBuildMesh.position.y = 0.2 + (this.mouse.y * 0.02); // Make sure the objects are higher at the bottom
    this.tempBuildMesh.position.z = this.currBlockPos.y;
    this.scene.add(this.tempBuildMesh);
  }

  updateTempBuildMesh = () =>
  {
    if (this.tempBuildMeshUpdate == 1)
    {
      var   spaceValid = 0;

      this.tempBuildMesh.position.x = this.currBlockPos.x + 0.5; // + 0.5 = CENTER OF BLOCK
      this.tempBuildMesh.position.z = this.currBlockPos.y + 0.5;
      var blockRightPos = new THREE.Vector2;
      blockRightPos.x = this.currBlockPos.x;
      blockRightPos.y = this.currBlockPos.y;

      this.debugPrint(2, "blockRightPos", blockRightPos);

      if (this.checkFree(blockRightPos, this.tempBuildMeshSize) == 1)
      {
        spaceValid = 1;
        this.debugPrint(2, "F_GREEN1");
        if (this.tempBuildMeshTextName != this.greenText)
        {
          this.debugPrint(2, "F_GREEN2");
          this.deleteObject(this.tempBuildMeshName);
          this.createObject_FindSpace(this.tempBuildMeshSize, this.tempBuildMeshName,
            this.tempBuildMeshType, this.tempBuildMeshProgress, this.greenText);
        }
      }
      else if (this.checkFree(blockRightPos, this.tempBuildMeshSize) == 0)
      {
        this.debugPrint(2, "G_RED1");
        if (this.tempBuildMeshTextName != this.redText)
        {
          this.debugPrint(2, "G_RED2");
          this.deleteObject(this.tempBuildMeshName);
          this.createObject_FindSpace(this.tempBuildMeshSize, this.tempBuildMeshName,
            this.tempBuildMeshType, this.tempBuildMeshProgress, this.redText);
        }
      }

      if (this.mouseLeftPressed == 1 && spaceValid == 1 && this.placementActive == 1) // NEED TO DO IT WITH RIGHT CLICK
      {
        var pos = new THREE.Vector2;
        pos.x = this.tempBuildMesh.position.x;
        pos.y = this.tempBuildMesh.position.z;

        this.tempBuildMeshUpdate = 0;

        this.debugPrint(2, "H_ClickLeft");
        this.createObject(pos, this.tempBuildMeshSize, this.UbuildingIDs + 1, this.tempBuildMeshType,
          this.tempBuildMeshProgress, this.normalText);
        this.deleteObject(this.tempBuildMeshName);
        this.placementActive = 0;
      }
      if (this.mouseMiddlePressed == 1 && this.placementActive == 1) // NEED TO TEST THE KEY
      {
        this.debugPrint(2, "I_ClickMiddle");
        this.tempBuildMeshUpdate = 0;
        this.deleteObject(this.tempBuildMeshName);
        this.placementActive = 0;
      }
    }
  }

  // CREATE GEOMETRY AND MESH ON TERRAIN
  createObject = (pos : THREE.Vector2, size : number, name : number,
    type : number, progress : number, nameText : String) =>
  {

    let newObject = new THREE.PlaneGeometry;
    if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {
      newObject = new THREE.PlaneGeometry(2, 2, 1, 1);
    }
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
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set(0.00, 0.00); // POSITION OF BUILDING ON TEXTURE
      matObj.map.offset.set((4 * (1 / 16)), (4 * (1 / 16))); //TEMPORARY
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }
    this.debugPrint(2, "G_CREATEOBJ_FUNC");

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name.toString();
    newObjectMesh.position.x = pos.x;// + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y;// + 0.5;
    this.scene.add(newObjectMesh);
  }

  // REPLACE GEOMETRY AND MESH ON TERRAIN
  replaceObject = (pos : THREE.Vector2, size : number, name : number,
    type : number, progress : number, nameText : String) =>
  {

    //call delete function
    this.deleteObject(name);

    let newObject = new THREE.PlaneGeometry;
    if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {
      newObject = new THREE.PlaneGeometry(2, 2, 1, 1);
    }
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
    newObjectMesh.name = name.toString();
    newObjectMesh.position.x = pos.x + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y + 0.5;
    this.scene.add(newObjectMesh);
  }

  // DELETE FORMER OBJECT IN SCENE USING NAME OR POS
  deleteObject = (name : number) =>
  {
    this.scene.remove(this.scene.getObjectByName(name.toString()) as THREE.Group)
    this.debugPrint(1, "This object has been deleted : ", name);
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
    if (event.button == 2)
    {
      this.debugPrint(1, "mouseRightPressed", true);
      this.mouseRightPressed = 1;
    }
    if (event.button == 0)
    {
      this.debugPrint(1, "mouseLeftPressed", true);
      this.mouseLeftPressed = 1;
    }
    if (event.button == 1)
    {
      this.debugPrint(1, "mouseMiddlePressed", true);
      this.mouseMiddlePressed = 1;
    }
  };

  onDocumentMouseUp = (event: any) =>
  {
    if (event.button == 2)
    {
      this.debugPrint(1, "mouseRightPressed", false);
      this.mouseRightPressed = 0;
    }
    if (event.button == 0)
    {
      this.debugPrint(1, "mouseLeftPressed", false);
      this.mouseLeftPressed = 0;
    }
    if (event.button == 1)
    {
      this.debugPrint(1, "mouseMiddlePressed", false);
      this.mouseMiddlePressed = 0;
    }
  };

  onMouseWheel = (event: any) =>
  {

    if (event.deltaY > 0)
    {
        this.mouseWheel = -1;
        if (this.camera.position.y > 45)
        {
          this.camera.position.y -= 15;
        }
    }
    else if (event.deltaY < 0)
    {
        this.mouseWheel = 1;
        if (this.camera.position.y < 300)
        {
          this.camera.position.y += 15;
        }
    }
    else
    {
        this.mouseWheel = 0;
    }
    this.debugPrint(1, "eventWheel", this.mouseWheel);
  }

  onDocumentKeyDown = (event: any) =>
  {
      event.preventDefault();
      event.stopPropagation(); 
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
    var time = Date.now();

    if (time - this.tempTime > 100)
    {
      this.timeClick = 1;
      this.tempTime = Date.now();
    }

    if (this.keyMap['Space'] == true && this.timeClick == 1 && this.placementActive == 0)
    {
      this.placementActive = 1;
      this.createObject_FindSpace(4, 9898, 1, 1, this.redText);
    }

    if (this.keyMap['keyD'] == true && this.timeClick == 1) // NOT WORKING !
    {
      this.debugPrint(2, "DEBUG MODE CHANGED TO ", this.debugMode);
      if (this.debugMode < 2)
      {
        this.debugMode = this.debugMode + 1;
      }
      else
      {
        this.debugMode = 0;
      }
    }

    this.mouseControls();

    this.rayCast();

    this.updateTempBuildMesh();

    // this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.update.bind(this));

    this.timeClick = 0;
  };
}

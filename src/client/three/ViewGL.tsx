import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import * as fs from "fs"
const { promises: Fs} = require('fs');
//import Fs from "fs";

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
  private terrainBorder = new THREE.Mesh;
  private terrainBackground = new THREE.Mesh;
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
  private selectedObj = new THREE.Vector2;
  private selectedObjData: any = [];
  private objectSelected: number = 0;
  private objectPopupOpen: number = 0;

  private worldType:number = 1;

  private greenText = "Matchbox_Tiles_Objects_GreenVersion";
  private redText = "Matchbox_Tiles_Objects_RedVersion";
  private normalText = "Matchbox_Tiles_Objects";
  private outlinedText = "Matchbox_Tiles_Objects_Outlined";

  private compArray: any[];
  private frontBlockArray: any[];
  private validatedBlockArray: any[];
  private rightBuildingType: any[];

  private firstLoad: number;

  private keyMap: any = [];

  private UbuildingIDs: number = 0;

  private timeClick = 1;
  private tempTime = Date.now();
  private tempTime2 = Date.now();

  private rawData: any = {};
  private chainEvent: number = 0;
  private chainDataAdded: number = 0;

  private readyToLoop: number = 0;
  private initDone: number = 0;

  // *********************** DEBUG/TEST *********************** //

  private debugMode = 1;
  private typeTest = 1;
  private stopData = 0;

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
    const skyColor = 0x73bed3;
    this.scene.background = new THREE.Color(0x73bed3);

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

    // INIT ARRAYS
    this.rightBuildingType = [];
    this.textArrRef = [];
    this.frontBlockArray = [];
    this.validatedBlockArray = [];
    this.compArray = [];


    // INIT TEXTUES ARRAY
    var x = 0;
    var y = 15;
    var value = 1;

    while (y >= 0)
    {
      this.textArrRef[y] = [];
      while (x < 16)
      {
        this.textArrRef[y][x] = value;
        this.debugPrint(2, "textArrRef");
        this.debugPrint(2,"y = ",y);
        this.debugPrint(2,"x = ",x);
        this.debugPrint(2, "value = ", this.textArrRef[y][x]);
        x++;
        value++;
      }
      x = 0;
      y--;
    }

    // ******************* GET WORLD READY *******************//

    // CALL ANIMATION LOOP
    this.update();

  }

  // ****************** FUNCTIONS OUT OF CONSTRUCTOR ********************** //

  // DECOMPOSE THE ARRAY OF DATA PER ELEMENT
  decompose = (elem: any) =>
  {
    var tempDecomp : any[] = [];

    this.debugPrint(1, "elemToDecomp = ", elem);
    this.debugPrint(1, "elem.lenght", elem.length);

    if (elem.length < 16)
    {
      this.debugPrint(1, "Adapted Decomp");
      tempDecomp[0] = parseInt(elem[0]);                      //[pos:x]
      tempDecomp[1] = parseInt(elem[1] + elem[2]);            //[pos:y]
      tempDecomp[2] = parseInt(elem[3]);                      //[mat type]
      tempDecomp[3] = parseInt(elem[4] + elem[5]);            //[ress or bat type]
      tempDecomp[4] = parseInt(elem[6] + elem[7] + elem[8]);  //[UNIQUE ID]
      tempDecomp[5] = parseInt(elem[9] + elem[10]);           //[health]
      tempDecomp[6] = parseInt(elem[11] + elem[12]);          //[quantity ress or pop]
      tempDecomp[7] = parseInt(elem[13]);                     //[current level]
      tempDecomp[8] = parseInt(elem[14]);                     //[activity index or number of days active]
      tempDecomp[9] = 0;                                      //[random ID]
    }
    else
    {
      this.debugPrint(1, "Classic Decomp");
      tempDecomp[0] = parseInt(elem[0] + elem[1]);            //[pos:x]
      tempDecomp[1] = parseInt(elem[2] + elem[3]);            //[pos:y]
      tempDecomp[2] = parseInt(elem[4]);                      //[mat type]
      tempDecomp[3] = parseInt(elem[5] + elem[6]);            //[ress or bat type]
      tempDecomp[4] = parseInt(elem[7] + elem[8] + elem[9]);  //[UNIQUE ID]
      tempDecomp[5] = parseInt(elem[10] + elem[11]);          //[health]
      tempDecomp[6] = parseInt(elem[12] + elem[13]);          //[quantity ress or pop]
      tempDecomp[7] = parseInt(elem[14]);                     //[current level]
      tempDecomp[8] = parseInt(elem[15]);                     //[activity index or number of days active]
      tempDecomp[9] = 0;                                      //[random ID]
    }
    this.debugPrint(2, "tempDecomp", tempDecomp);

    return (tempDecomp);
  }

  getTypeFromCompArr = () =>
  {

    this.rightBuildingType[0] = 0;
    this.rightBuildingType[1] = 1;
    this.rightBuildingType[2] = 179//[161,163,165,177,178,179,180,181,182];
    this.rightBuildingType[3] = 15//[15,14,30,31];
    this.rightBuildingType[4] = 3;
    this.rightBuildingType[5] = 10;
    this.rightBuildingType[6] = 5;
    this.rightBuildingType[7] = 8;
    this.rightBuildingType[8] = 7;
    this.rightBuildingType[9] = 6;
    this.rightBuildingType[10] = 59;
    this.rightBuildingType[11] = 11;
    this.rightBuildingType[12] = 9;
    this.rightBuildingType[13] = 12;
    this.rightBuildingType[14] = 13;
    this.rightBuildingType[15] = 60;
    this.rightBuildingType[16] = 52;
    this.rightBuildingType[17] = 58;
    this.rightBuildingType[18] = 61;
    this.rightBuildingType[19] = 4;
    this.rightBuildingType[20] = 20;
    this.rightBuildingType[21] = 14;
    this.rightBuildingType[22] = 49;
    this.rightBuildingType[23] = 57;
    this.rightBuildingType[24] = 100;

    /*

   Cabin = 1
   Cabin Destroyed = 2
   Rock = 161,163,165,177,178,179,180,181,182
   Tree = 15,14,30,31
   House = 3 (Upgrade 1 : 10 / Upgrade 2 : 39)
   Lumberjack = 4
   Hotel = 5 (Upgrade 1 : 37   / Upgrade 2 : 38)
   Restaurant =  6
   Grocery Store = 7
   Bakery = 8
   Library = 9
   Bar = 11
   Swimming Pool = 12
   Cinema = 13
   Coal Plant = 14
   Gold Mine = 17 (Builded = 18)
   Coal Mine = 19 (Builded = 20)
   Phosphore Mine = 21 (Builded = 22 )
   Metal Mine = 23 (Builded = 24)
   Wheat Farm = 52
   Police Station = 49  (Upgrade = 56)
   Hospital = 57
   Vegetable Farm = 58
   Mall = 59
   Market = 60
   Cow Farm = 61
   Under Construction 1X1 = 81
   Under Construction 2X1 = 82
   Under Construction 2X2 = 83
   Green Tile 2X2 :  209  ( Red = 210)

   Green Tile 1X1  : 225 (Red = 226)
   Green Tile 2X1 : 229 - 230

    ON CHAIN

    Cabin = 1
    Rock = 2
    Tree = 3
    House = 4
    Appartment = 5
    Hotel = 6
    Boulangerie = 7
    GroceryShop = 8
    Restaurant = 9
    Mall = 10
    Bar = 11
    Library = 12
    SwimmingPool = 13
    Cinema = 14
    Market = 15
    CerealFarm = 16
    VegetableFarm = 17
    CowFarm = 18
    TreeFarm = 19
    Mine = 20
    CoalPlant = 21
    PoliceStation = 22
    Hospital = 23
    Lab = 24
    */
  }

  generateRessources = () =>
  {

    // DECOMPOSE ARRAY OF DATA [RECEIVED FROM BC]

    var indexI = 1;
    var indexJ = 1;
    var i = 0;

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
          this.frontBlockArray[indexI][indexJ][4] = i;
        }
        indexJ++;
        i++;
      }
      indexJ = 1;
      indexI++;
    }
    console.log("this.frontBlockArray", this.frontBlockArray);

    this.firstLoad = 0;

    i = 0;
    indexI = 1;
    indexJ = 1;

    while (indexI < 17)
    {
      while (indexJ < 41)
      {
        if (this.frontBlockArray[indexI][indexJ] != null
            && this.frontBlockArray[indexI][indexJ][3] != null
            && this.frontBlockArray[indexI][indexJ][3] != 0//)
            && this.frontBlockArray[indexI][indexJ][4] != 0)//DEBUG CONDITION "ANTI 0"
        {
          var pos = new THREE.Vector2;
          pos.x = this.frontBlockArray[indexI][indexJ][0];// + 0.5;
          pos.y = this.frontBlockArray[indexI][indexJ][1];// + 0.5;

          /*if (pos.x > 39 || pos.y < 1 || pos.x < 1 || pos.y > 15)
          {
            this.debugPrint(1, "POS ERROR INDEX ", this.frontBlockArray[indexI][indexJ][4]);
            this.debugPrint(1, "POSX", pos.x);
            this.debugPrint(1, "POSY", pos.y);
          }
          if (this.frontBlockArray[indexI][indexJ][4] == 0)
          {
            this.debugPrint(1, "ID ERROR = ", this.frontBlockArray[indexI][indexJ][4]);
            this.debugPrint(1, "POSX", pos.x);
            this.debugPrint(1, "POSY", pos.y);
          }*/
          if (this.frontBlockArray[indexI][indexJ][3] == 2 || this.frontBlockArray[indexI][indexJ][3] == 3)
          {
            this.frontBlockArray[indexI][indexJ][9] = (Math.random() * (3 - 1) + 1).toFixed(0);
          }

          //this.createObjectFomChain(pos, 1, this.frontBlockArray[indexI][indexJ][4],
            //this.frontBlockArray[indexI][indexJ][3], 1, this.normalText);
          this.createObjectFomChain(pos, 1, this.frontBlockArray[indexI][indexJ][4],
              this.frontBlockArray[indexI][indexJ][3], 1, this.normalText);

          this.UbuildingIDs++;
          this.debugPrint(1, "GENTYPE", this.frontBlockArray[indexI][indexJ][3]);

        }

        if (this.frontBlockArray[indexI][indexJ][4] == 0) // DEBUG CONDITION WITH "ANTI 0"
        {
          this.frontBlockArray[indexI][indexJ][3] = 0;
        }

        indexJ++;
      }
      indexJ = 1;
      indexI++;
    }
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
        "resources/textures/World_Background_"+this.worldType.toString()+".png"
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
      this.terrain.position.y = 0;
      this.scene.add(this.terrain);
  };

  terrainBorderCreate = () =>
  {
      let terrainBorderPlane = new THREE.PlaneGeometry(43.9, 21, 1, 1);
      terrainBorderPlane.name = "terrainBorderGeometry";
      terrainBorderPlane.rotateX(-Math.PI * 0.5);
      const texture = new THREE.TextureLoader().load(
        "resources/textures/World_Boundaries_"+this.worldType.toString()+".png"
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

      this.terrainBorder = new THREE.Mesh(terrainBorderPlane, mat);
      this.terrainBorder.name = "terrainBorderMesh";
      this.terrainBorder.position.x = 20.94;
      this.terrainBorder.position.z = 9;
      this.terrainBorder.position.y = -0.1;
      this.scene.add(this.terrainBorder);
  };


  terrainBackgroundCreate = () =>
  {
      let terrainBackgroundPlane = new THREE.PlaneGeometry(150, 150, 1, 1);
      terrainBackgroundPlane.name = "terrainBackgroundGeometry";
      terrainBackgroundPlane.rotateX(-Math.PI * 0.5);
      const texture = new THREE.TextureLoader().load(
        "resources/textures/Water_Tile.png"
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

      this.terrainBackground = new THREE.Mesh(terrainBackgroundPlane, mat);
      this.terrainBackground.name = "terrainBackgroundMesh";
      this.terrainBackground.position.x = 21;
      this.terrainBackground.position.z = 9;
      this.terrainBackground.position.y = -0.2;
      this.scene.add(this.terrainBackground);
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
      var rayX = parseInt((tempRayPos.x).toFixed(2));
      var rayY = parseInt((tempRayPos.z).toFixed(2));

      if (rayX < 40 && rayX > 0 && rayY < 16 && rayY > 0)
      {
        this.debugPrint(1, "VALID RAYCAST");
        this.currBlockPos.x = rayX;
        this.currBlockPos.y = rayY;
        //this.currRayPos = tempRayPos;
      }
      else
      {
        this.debugPrint(1, "INVALID RAYCAST");
        this.currBlockPos.x = 0;
        this.currBlockPos.y = 0;
      //  this.currRayPos = tempRayPos;
      }
      this.debugPrint(2, "rayX", rayX);
      this.debugPrint(2, "rayY", rayY);
      //this.debugPrint(2, "currBlockPos", this.currBlockPos);
    }
  }

  // OBJECT MOUSE SELECTION
  selectObject = () =>
  {
    if (this.objectSelected == 0)
    {
      if (this.currBlockPos && this.currBlockPos.x != null && this.currBlockPos.y != null &&
         this.currBlockPos.x > 0 && this.currBlockPos.x < 40 && this.currBlockPos.y > 0 &&
         this.currBlockPos.y < 16 && this.frontBlockArray[this.currBlockPos.y][this.currBlockPos.x] != null &&
         this.frontBlockArray[this.currBlockPos.y][this.currBlockPos.x][3] != null &&
         this.frontBlockArray[this.currBlockPos.y][this.currBlockPos.x][3] != 0
      )
      {

        var pos : THREE.Vector2 = new THREE.Vector2;
        pos.x = this.currBlockPos.x;
        pos.y = this.currBlockPos.y;

        this.objectSelected = 1;

        this.replaceObject(pos, this.frontBlockArray[pos.y][pos.x][7],
          this.frontBlockArray[pos.y][pos.x][4],
          this.frontBlockArray[pos.y][pos.x][3], 1, this.outlinedText,
          this.frontBlockArray[pos.y][pos.x][4]);

        this.selectedObj = pos;
        this.selectedObjData[0] = this.frontBlockArray[pos.y][pos.x][0];//PosX
        this.selectedObjData[1] = this.frontBlockArray[pos.y][pos.x][1];//PosY
        this.selectedObjData[3] = this.frontBlockArray[pos.y][pos.x][3];//build/Ress Type
        this.selectedObjData[4] = this.frontBlockArray[pos.y][pos.x][4];//id/name

        this.debugPrint(1, "OBJECT SELECTED", this.selectedObjData[4]);
      }
    }

    if (this.objectSelected == 1)
    {
      if (//this.currBlockPos &&     // TOO MANY SAFETY PRCAUTIONS MAKE IT SLOWER
          //this.selectedObj != null && this.selectedObj.x != 0 && this.selectedObj.y != 0 &&
          this.selectedObj.x != this.currBlockPos.x || this.selectedObj.y != this.currBlockPos.y //&&
          //this.frontBlockArray[this.currBlockPos.y][this.currBlockPos.x] != null &&
          //this.frontBlockArray[this.currBlockPos.y][this.currBlockPos.x][3] != 0
          )
      {

        var pos : THREE.Vector2 = new THREE.Vector2;
        pos.x = this.selectedObj.x;
        pos.y = this.selectedObj.y;

        this.debugPrint(1, "OBJECT UNSELECTED", this.selectedObjData[4]);
        this.objectSelected = 0;

        this.replaceObject(pos, this.frontBlockArray[this.selectedObj.y][this.selectedObj.x][7],
          this.frontBlockArray[pos.y][pos.x][4],
          this.frontBlockArray[this.selectedObj.y][this.selectedObj.x][3], 1,
          this.normalText, this.frontBlockArray[this.selectedObj.y][this.selectedObj.x][4]);

        this.selectedObj = new THREE.Vector2(0, 0);

        this.selectedObjData[0] = 0;//PosX
        this.selectedObjData[1] = 0;//PosY
        this.selectedObjData[3] = 0;//build/Ress Type
        this.selectedObjData[4] = 0;//id/name

        this.debugPrint(1, "UNSELECTED OBJECT IS", this.selectedObjData[4]);
      }
    }


    if (this.objectSelected == 1 && this.mouseLeftPressed == 1)
    {
      this.debugPrint(1, "OBJECT POPUP OPEN");
      // To open popup
      this.rawData.updateBuildingFrame(true, {"id": 1});
      this.objectPopupOpen = 1;

      //this.selectedObjData[0] ;//PosX
      //this.selectedObjData[1] ;//PosY
      //this.selectedObjData[3] ;//build/Ress Type
      //this.selectedObjData[4] ;//id/name

      // To close popup
      // this.rawData.updateBuildingFrame(false, {});
    }
  }

  // CHECK IF BLOCKS ARE FREE BASED ON BUILDING SIZE
  checkFree = (pos : THREE.Vector2, numB : number) =>
  {
    if (pos.x >= 1 && pos.x <= 40 && pos.y >= 1 && pos.y <= 16)
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
      else if (pos.y - 1 != 0 && numB == 4)
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

  //FIND TEXTURE POSITION WITH BUILDING TYPE NUMBER
  findTextByID = (type : number) =>
  {
    var posText = new THREE.Vector2;
    var x = 0;
    var y = 15;

    while (y >= 0)
    {
      while (x < 16)
      {
        //this.debugPrint(2, "type", type);
        //this.debugPrint(2, "this.textArrRef[y][x]", this.textArrRef[y][x]);
        if (type == this.textArrRef[y][x])
        {
          posText.x = (x * (1 / 16));
          posText.y = (y * (1 / 16));
          this.debugPrint(1, "posText Found");
          return (posText);
        }
        x++;
      }
      x = 0;
      y--;
    }
    this.debugPrint(1, "posText Not Found");
    return (0);
  }

  exists = (path: String) =>
  {
    try
    {
      Fs.access(path);
      return (true);
    }
    catch
    {
      return (false);
    }
  }


  // CREATE TEMPORARY BUILDING THAT FOLLOWS CURSOR AND CHANGES COLOR BASED ON POSSIBLE
  // SPACE OR NOT + GETS DELETE IF SPACE FOUND AND ACTIVATED OR CREATION CANCELED
  createObject_FindSpace = (size : number, name : number,
    type : number, progress : number, nameText : String) =>
  {

    let newObject = new THREE.PlaneGeometry;
    /*if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {*/
      newObject = new THREE.PlaneGeometry(3.5, 3.5, 1, 1);
    //}
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    let  textObj;
    if (this.exists("resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"))
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"
      );
    }
    else
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_0.png"
      );
    }

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    var textureType : any = new THREE.Vector2;
    textureType = this.findTextByID(this.rightBuildingType[type]);

    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set((0 * (1 / 16)), (6 * (1 / 16))); // X/Y
      matObj.map.offset.set(textureType.x, textureType.y);
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
    this.debugPrint(1, "E_CREATE_TEMPFINDSPACE_FUNC");

    this.tempBuildMesh = new THREE.Mesh(newObject, matObj);
    this.tempBuildMesh.name = name.toString();
    this.tempBuildMesh.position.x = this.currBlockPos.x + 0.5;
    this.tempBuildMesh.position.y = 0.2 + (this.mouse.y * 0.02); // Make sure the objects are higher at the bottom
    this.tempBuildMesh.position.z = this.currBlockPos.y;
    this.scene.add(this.tempBuildMesh);
  }

  // UPDATE THE MESH THAT FOLLOWS THE CURSOR WHEN PLACING OBJECT
  // AND CHANGE TEXTURE IF SPACE FREE OR NOT
  updateTempBuildMesh = () =>
  {
    if (this.tempBuildMeshUpdate == 1)
    {
      var   spaceValid = 0;

      this.tempBuildMesh.position.x = this.currBlockPos.x + 0.5; // + 0.5 = CENTER OF BLOCK
      this.tempBuildMesh.position.z = this.currBlockPos.y;// + 0.5;
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
        this.createObjectPlayer(pos, this.tempBuildMeshSize, this.frontBlockArray[pos.y][pos.x - 0.5][4],
           this.tempBuildMeshType,this.tempBuildMeshProgress, this.normalText);
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
    /*if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {*/
      newObject = new THREE.PlaneGeometry(3.5, 3.5, 1, 1);
    //}
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    let  textObj;
    if (this.exists("resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"))
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"
      );
    }
    else
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_0.png"
      );
    }

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    var textureType : any = new THREE.Vector2;

    if (this.frontBlockArray[pos.y][pos.x][9] > 0)
    {
      if (this.frontBlockArray[pos.y][pos.x][3] == 2)
      {
        if (this.frontBlockArray[pos.y][pos.x][9] == 1)
        {
          textureType = this.findTextByID(177);
          this.debugPrint(1, "IN RANDOM CONDITION");
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 2)
        {
          textureType = this.findTextByID(180);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 3)
        {
          textureType = this.findTextByID(179);
        }
      }//Rock = 161,163,165,177,178,179,180,181,182   Tree = 15,14,30,31
      else
      {
        if (this.frontBlockArray[pos.y][pos.x][9] == 1)
        {
          textureType = this.findTextByID(15);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 2)
        {
          textureType = this.findTextByID(16);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 3)
        {
          textureType = this.findTextByID(30);
        }
      }
    }
    else
    {
      textureType = this.findTextByID(this.rightBuildingType[type]);
    }


    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set((4 * (1 / 16)), (4 * (1 / 16))); //TEMPORARY
      matObj.map.offset.set(textureType.x, textureType.y);
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }
    this.debugPrint(1, "G_CREATEOBJ_FUNC");

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name.toString();
    newObjectMesh.position.x = pos.x + 0.5;// + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y;// + 0.5;
    this.scene.add(newObjectMesh);
    this.frontBlockArray[pos.y - 0.5][pos.x - 0.5][3] = type;
    this.frontBlockArray[pos.y - 0.5][pos.x - 0.5][0] = pos.x + 0.5;// - 0.5;
    this.frontBlockArray[pos.y - 0.5][pos.x - 0.5][1] = pos.y;// - 0.5;
    this.frontBlockArray[pos.y - 0.5][pos.x - 0.5][4] = name;
    this.frontBlockArray[pos.y - 0.5][pos.x - 0.5][7] = size;
  }

  buildingTransaction = (pos: THREE.Vector2, type: number, name: number) =>
  {

    // CREATE THE TRANSACTION

  }

  // PLAYER CREATES GEOMETRY AND MESH ON TERRAIN ON CLICK
  createObjectPlayer = (pos : THREE.Vector2, size : number, name : number,
    type : number, progress : number, nameText : String) =>
  {

    let newObject = new THREE.PlaneGeometry;
    /*if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {*/
      newObject = new THREE.PlaneGeometry(3.5, 3.5, 1, 1);
    //}
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    let  textObj;
    if (this.exists("resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"))
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"
      );
    }
    else
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_0.png"
      );
    }

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    var textureType : any = new THREE.Vector2;

    if (this.frontBlockArray[pos.y][pos.x - 0.5][9] > 0)
    {
      if (this.frontBlockArray[pos.y][pos.x - 0.5][3] == 2)
      {
        if (this.frontBlockArray[pos.y][pos.x - 0.5][9] == 1)
        {
          textureType = this.findTextByID(177);
          this.debugPrint(1, "IN RANDOM CONDITION");
        }
        else if (this.frontBlockArray[pos.y][pos.x - 0.5][9] == 2)
        {
          textureType = this.findTextByID(180);
        }
        else if (this.frontBlockArray[pos.y][pos.x - 0.5][9] == 3)
        {
          textureType = this.findTextByID(179);
        }
      }//Rock = 161,163,165,177,178,179,180,181,182   Tree = 15,14,30,31
      else
      {
        if (this.frontBlockArray[pos.y][pos.x - 0.5][9] == 1)
        {
          textureType = this.findTextByID(15);
        }
        else if (this.frontBlockArray[pos.y][pos.x - 0.5][9] == 2)
        {
          textureType = this.findTextByID(16);
        }
        else if (this.frontBlockArray[pos.y][pos.x - 0.5][9] == 3)
        {
          textureType = this.findTextByID(30);
        }
      }
    }
    else
    {
      textureType = this.findTextByID(this.rightBuildingType[type]);
    }


    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set((4 * (1 / 16)), (4 * (1 / 16))); //TEMPORARY
      matObj.map.offset.set(textureType.x, textureType.y);
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }
    this.debugPrint(1, "G_CREATEOBJ_FUNC");

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name.toString();
    newObjectMesh.position.x = pos.x + 0.5;// + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y;// + 0.5;
    this.scene.add(newObjectMesh);
    this.frontBlockArray[pos.y][pos.x - 0.5][3] = type;
    this.frontBlockArray[pos.y][pos.x - 0.5][0] = pos.x + 0.5;// - 0.5;
    this.frontBlockArray[pos.y][pos.x - 0.5][1] = pos.y;// - 0.5;
    this.frontBlockArray[pos.y][pos.x - 0.5][4] = name;
    this.frontBlockArray[pos.y][pos.x - 0.5][7] = size;

    var posTrans = new THREE.Vector2;
    posTrans.x = pos.x - 0.5;
    posTrans.y = pos.y;

    //DO THE BUILDING CREATION TRANSACTION
    this.buildingTransaction(pos, this.frontBlockArray[pos.y][pos.x - 0.5][3],
      this.frontBlockArray[pos.y][pos.x - 0.5][4]);
  }

  // CREATE GEOMETRY AND MESH ON TERRAIN FROM CHAIN DATA
  createObjectFomChain = (pos : THREE.Vector2, size : number, name : number,
    type : number, progress : number, nameText : String) =>
  {

    let newObject = new THREE.PlaneGeometry;
    /*if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {*/
      newObject = new THREE.PlaneGeometry(3.5, 3.5, 1, 1);
    //}
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    let  textObj;
    if (this.exists("resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"))
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"
      );
    }
    else
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_0.png"
      );
    }

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    var textureType : any = new THREE.Vector2;

    if (this.frontBlockArray[pos.y][pos.x][9] > 0)
    {
      if (this.frontBlockArray[pos.y][pos.x][3] == 2)
      {
        if (this.frontBlockArray[pos.y][pos.x][9] == 1)
        {
          textureType = this.findTextByID(177);
          this.debugPrint(1, "IN RANDOM CONDITION");
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 2)
        {
          textureType = this.findTextByID(180);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 3)
        {
          textureType = this.findTextByID(179);
        }
      }//Rock = 161,163,165,177,178,179,180,181,182   Tree = 15,14,30,31
      else
      {
        if (this.frontBlockArray[pos.y][pos.x][9] == 1)
        {
          textureType = this.findTextByID(15);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 2)
        {
          textureType = this.findTextByID(16);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 3)
        {
          textureType = this.findTextByID(30);
        }
      }
    }
    else
    {
      textureType = this.findTextByID(this.rightBuildingType[type]);
    }

    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set((4 * (1 / 16)), (4 * (1 / 16))); //TEMPORARY
      matObj.map.offset.set(textureType.x, textureType.y);
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }
    this.debugPrint(1, "G_CREATEOBJ_FUNC_FROM_CHAIN");

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name.toString();
    newObjectMesh.position.x = pos.x + 0.5;// + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y;// + 0.5;
    this.scene.add(newObjectMesh);
    /*this.frontBlockArray[pos.y][pos.x][3] = type;
    this.frontBlockArray[pos.y][pos.x][0] = pos.x;// - 0.5;
    this.frontBlockArray[pos.y][pos.x][1] = pos.y;// - 0.5;
    this.frontBlockArray[pos.y][pos.x][4] = name;
    this.frontBlockArray[pos.y][pos.x][7] = size;*/
  }

  // REPLACE GEOMETRY AND MESH ON TERRAIN
  replaceObject = (pos : THREE.Vector2, size : number, name : number,
    type : number, progress : number, nameText : String, nameToDelete : number) =>
  {

    //call delete function
    this.deleteObject(nameToDelete);

    let newObject = new THREE.PlaneGeometry;
    /*if (size == 1)
    {
      newObject = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    else if (size == 2)
    {
      newObject = new THREE.PlaneGeometry(2, 1, 1, 1);
    }
    else if (size == 4)
    {*/
      newObject = new THREE.PlaneGeometry(3.5, 3.5, 1, 1);
    //}
    newObject.name = name + "_geom";
    newObject.rotateX(-Math.PI * 0.5);

    let  textObj;
    if (this.exists("resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"))
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_"+this.worldType.toString()+".png"
      );
    }
    else
    {
      textObj = new THREE.TextureLoader().load(
        //"resources/textures/"+ nameText +".png"
        "resources/textures/"+ nameText +"_nogrid_0.png"
      );
    }

    let matObj = new THREE.MeshStandardMaterial({
      map: textObj,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // shading: 2
    });

    var textureType : any = new THREE.Vector2;

    if (this.frontBlockArray[pos.y][pos.x][9] > 0)
    {
      if (this.frontBlockArray[pos.y][pos.x][3] == 2)
      {
        if (this.frontBlockArray[pos.y][pos.x][9] == 1)
        {
          textureType = this.findTextByID(177);
          this.debugPrint(1, "IN RANDOM CONDITION");
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 2)
        {
          textureType = this.findTextByID(180);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 3)
        {
          textureType = this.findTextByID(179);
        }
      }//Rock = 161,163,165,177,178,179,180,181,182   Tree = 15,14,30,31
      else
      {
        if (this.frontBlockArray[pos.y][pos.x][9] == 1)
        {
          textureType = this.findTextByID(15);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 2)
        {
          textureType = this.findTextByID(16);
        }
        else if (this.frontBlockArray[pos.y][pos.x][9] == 3)
        {
          textureType = this.findTextByID(30);
        }
      }
    }
    else
    {
      textureType = this.findTextByID(this.rightBuildingType[type]);
    }


    if (matObj.map)
    {
      matObj.map.repeat = new THREE.Vector2(0.0625, 0.0625); // TEXTURE TILLING ADAPTED TO BUILDING TILES
      //matObj.map.offset.set((4 * (1 / 16)), (4 * (1 / 16))); //TEMPORARY
      matObj.map.offset.set(textureType.x, textureType.y);
      matObj.map.wrapS = THREE.RepeatWrapping; // REPEAT X
      matObj.map.wrapT = THREE.RepeatWrapping; // REPEAT Y
      matObj.map.magFilter = THREE.NearestFilter; // NEAREST/LINEAR FILTER LinearFilter NearestFilter
    }
    this.debugPrint(1, "G_REPLACEOBJ_FUNC");

    var newObjectMesh = new THREE.Mesh(newObject, matObj);
    newObjectMesh.name = name.toString();
    newObjectMesh.position.x = pos.x + 0.5;// + 0.5;
    newObjectMesh.position.y = 0.2 + (pos.y * 0.02); // Make sure the objects are higher at the bottom
    newObjectMesh.position.z = pos.y;// + 0.5;
    this.scene.add(newObjectMesh);
    this.frontBlockArray[pos.y][pos.x][3] = type;
    this.frontBlockArray[pos.y][pos.x][0] = pos.x + 0.5;
    this.frontBlockArray[pos.y][pos.x][1] = pos.y;// - 0.5;
    this.frontBlockArray[pos.y][pos.x][4] = name;
    this.frontBlockArray[pos.y][pos.x][7] = size;
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

  onReceivedUpdatedData = (data: any) =>
  {
    // Store once all the data receive so we can access callback functions

    if (this.stopData == 0)
    {
      this.chainEvent = 1;

      if (Object.keys(this.rawData).length == 0)
      {
        this.rawData = data;
      }
      if (Object.keys(data.mapArray).length > 1)
      {
        this.compArray = data.mapArray;
        this.chainDataAdded = 1;
      }
    }
  }

  // ******************* RENDER LOOP ******************* //


  update = (t?: any) =>
  {
    if (this.chainDataAdded == 1 && this.initDone == 0)
    {
      this.debugPrint(1, "INIT");
      this.getTypeFromCompArr();
      this.generateRessources();

      // CREATE TERRAIN
      this.terrainCreate();
      this.terrainBorderCreate();
      this.terrainBackgroundCreate();

      this.readyToLoop = 1;
      this.initDone = 1;
      this.stopData = 1;
    }

    if (this.readyToLoop == 1)
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
        this.createObject_FindSpace(1, 9898, this.typeTest, 1, this.redText);
        this.typeTest++;
      }

      if (this.keyMap['KeyD'] == true && this.timeClick == 1) // NOT WORKING !
      {
        if (this.debugMode < 2)
        {
          this.debugMode = this.debugMode + 1;
          this.debugPrint(1, "DEBUG MODE CHANGED TO ", this.debugMode);
        }
        else
        {
          this.debugPrint(1, "DEBUG MODE CHANGED TO 0");
          this.debugMode = 0;
        }
      }

      this.mouseControls();

      this.rayCast();

      this.updateTempBuildMesh();

      if (this.placementActive == 0)// && time - this.tempTime2 > 10)
      {
        this.selectObject();
        //this.tempTime2 = Date.now();
      }
      // this.stats.update();
      this.renderer.render(this.scene, this.camera);


      this.timeClick = 0;
    }
    requestAnimationFrame(this.update.bind(this));
  };
}

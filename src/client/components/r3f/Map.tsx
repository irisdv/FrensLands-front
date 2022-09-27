import React, { memo, ReactElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, NearestFilter, PlaneGeometry, Vector2, Vector3, AudioLoader } from "three";
const { promises: Fs} = require('fs');

import { useGameContext } from '../../hooks/useGameContext'
import { useBVH } from '@react-three/drei';
import { useSelectContext } from '../../hooks/useSelectContext';
import { BuildingTemp } from './BuildingTemp';
import Resources from './Resources';
import { Frens } from './Frens'
import useTest from '../../hooks/invoke/useTest';
import { useStarknet } from '@starknet-react/core';

import useTxGame from '../../hooks/useTxGame'
import { useNotifTransactionManager } from '../../providers/transactions';
import useBuild from '../../hooks/invoke/useBuild';

export interface ISelectObject {
    unique_id?: any;
    type_id: any;
    pos?: Vector2;

}

export const Map = (props : any)=> {
    const { frontBlockArray, rightBuildingType, textArrRef, worldType, mouseLeftPressed, mouseMiddlePressed, mouseRightPressed, buildingsIDs } = props

    const mapRef = useRef<any>()
    useBVH(mapRef)
    const musicRef = useRef<THREE.Audio>()
    const { scene, raycaster, camera } = useThree()

    // Audio
    // const menuTheme = useLoader(AudioLoader, "resources/sounds/ogg/FrensLand_MenuTheme.ogg");
    // const [listener] = useState(() => new AudioListener());

    // Context
    const { account } = useStarknet();
    const { tokenId, nonce, updateNonce, populationBusy, populationFree, harvestingArr, setHarvesting } = useGameContext();
    const { transactions, removeTransaction } = useNotifTransactionManager()
    const { frameData, updateBuildingFrame, sound } = useSelectContext();

    // Buildings
    var currBlockPos = new Vector2(0, 0)
    const [placementActive, setPlacementActive] = useState(0)
    const [tempBuildMeshTexture, setTempBuildMeshTexture] = useState(1)
    const [tempBuildMeshSize, setTempBuildMeshSize] = useState(1)
    const [tempBuildMesh, setTempBuildMesh] = useState(new Vector3(0,0,0))
    const [spaceValid, setSpaceValid] = useState(0)
    const [UBlockIDs, setUBlockIDs] = useState(buildingsIDs)
    const [animIndex, setAnimIndex] = useState(1)
    const [curT, setCurT] = useState(Date.now())

    // Select objects
    const [objectSelected, setObjectSelected] = useState(0);
    const [selectedObj, setSelectedObj] = useState<ISelectObject>();
    const [currBlockPosState, setCurrBlockPosState] = useState(new Vector2);

    const nonceValue = useMemo(() => {
        console.log('new nonce value', nonce)
        return nonce
    }, [nonce])

    // Frens
    const frensArray = useMemo(() => {
        var max = 1;
        if (populationBusy && populationFree) {
            if (populationBusy + populationFree > 35) {
                max = 7
            } else {
                max = parseInt(((populationBusy + populationFree) / 5).toFixed(0)) + 1
            }
        }
        var i = 0;
        var tempArray = []
        while (i < max) {
            var curPos = new Vector2;
            var targetPos = new Vector2;

            curPos.x = parseInt((Math.random() * (39 - 1) + 1).toFixed(0));
            curPos.y = parseInt((Math.random() * (15 - 1) + 1).toFixed(0));
            targetPos.x = parseInt((Math.random() * (39 - 1) + 1).toFixed(0));
            targetPos.y = parseInt((Math.random() * (15 - 1) + 1).toFixed(0));

            tempArray.push({'curPos': curPos, 'targetPos': targetPos})

            i++;
        }

        return tempArray
    }, [populationBusy, populationFree])

    const frameDataValue = useMemo(() => {
        if (frameData) {
            if (frameData.selected == 1) setPlacementActive(1)
            return frameData
        }
    }, [frameData])

    function exists(path: String) {
      try {
        Fs.access(path);
        return (true);
      } catch {
        return (false);
      }
    }



    useFrame(({ mouse, raycaster }) => {
        if ((Date.now() - curT) > 150)
        {
            if (animIndex <= 3)
            {
                setAnimIndex(animIndex + 1)
            }
            
            if (animIndex == 3)
            {
                setAnimIndex(0)
            }

            //console.log("animIndex = ", animIndex)
            setCurT(Date.now())
        }



        currBlockPos = new Vector2(0, 0);

        const intersects = raycaster.intersectObjects(scene.children, true)
        var tempRayPos = new Vector3;
        var tempInter : any[] = [];
        var tempInterY : any[] = [];
        var i = 0;
        var k = 0;
        var j = 0;
        while (i < intersects.length)
        {
            if (intersects[i].point.y > -1 && intersects[i].point.x > 1 && intersects[i].point.z > 1)
            {
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
                // console.log('VALID RAYCAST')
                currBlockPos.x = rayX;
                currBlockPos.y = rayY;
            }
            else
            {
                // console.log('INVALID RAYCAST')
                currBlockPos.x = 0;
                currBlockPos.y = 0;
            }

            setCurrBlockPosState(new Vector2(currBlockPos.x, currBlockPos.y))
            // console.log('rayX', rayX)
            // console.log('rayY', rayY)
            // this.debugPrint(1, "blockChain-Elem = ", (((16 - (rayY - 1)) * 40) + (rayX) + 1));

            if (placementActive == 1) {
                setTempBuildMesh(new Vector3(currBlockPos.x + 0.5, /*0.2*/ 0.2 + (mouse.y * 0.02), currBlockPos.y))
                updateTempBuildMesh(currBlockPos)
            }

            if (objectSelected == 0) {
                if (currBlockPos && currBlockPos.x != null && currBlockPos.y != null &&
                    currBlockPos.x > 0 && currBlockPos.x < 40 && currBlockPos.y > 0 &&
                    currBlockPos.y < 16 && frontBlockArray[currBlockPos.y][currBlockPos.x] != null &&
                    frontBlockArray[currBlockPos.y][currBlockPos.x][3] != null &&
                    frontBlockArray[currBlockPos.y][currBlockPos.x][3] != 0)
                {
                    var pos : THREE.Vector2 = new Vector2;
                    pos.x = currBlockPos.x;
                    pos.y = currBlockPos.y;

                    setObjectSelected(1)
                    let obj : ISelectObject = {
                        "pos" : pos,
                        "type_id": frontBlockArray[currBlockPos.y][currBlockPos.x][3],
                        "unique_id" : frontBlockArray[currBlockPos.y][currBlockPos.x][4]
                    }
                    setSelectedObj(obj)

                }
            }

            if (objectSelected == 1) {
                if (selectedObj && selectedObj?.pos?.x != currBlockPos.x || selectedObj?.pos?.y != currBlockPos.y)
                {
                    // No objects are selected on the map
                    var pos : THREE.Vector2 = new Vector2;
                    pos.x = selectedObj?.pos?.x as number;
                    pos.y = selectedObj?.pos?.y as number;

                    setObjectSelected(0)

                    let obj : ISelectObject = {
                        "pos" : new Vector2(0, 0),
                        "type_id": 0,
                        "unique_id" : 0
                    }
                    setSelectedObj(obj)
                }
            }

            if (objectSelected == 1 && mouseLeftPressed == 1)
            {
                // OPEN POPUP BUILDING WITH INFORMATION - NOT SELECTED
                updateBuildingFrame(true, {
                    "id": selectedObj?.type_id,
                    "level": frontBlockArray[rayY][rayX][7],
                    "unique_id": selectedObj?.unique_id,
                    "posX": frontBlockArray[rayY][rayX][0],
                    "posY": frontBlockArray[rayY][rayX][1],
                    "selected": 0
                });
            }
        }

        // FRENS GOING
        var i = 0;
        frensArray.map((fren : any, id : any) => {
            var tempValX = 0;
            var tempValY = 0;

            if (fren) {
                if (parseInt(fren['curPos'].x.toFixed(1)) == fren['targetPos'].x) {
                    tempValX = 1;
                } else if (fren['curPos'].x > fren['targetPos'].x) {
                    fren['curPos'].x  -= 0.01;
                } else {
                    fren['curPos'].x  += 0.01;
                }

                if (parseInt(fren['curPos'].y.toFixed(1)) == fren['targetPos'].y) {
                    tempValY = 1;
                } else if (fren['curPos'].y > fren['targetPos'].y) {
                    fren['curPos'].y  -= 0.01;
                } else {
                    fren['curPos'].y  += 0.01;
                }

                if (tempValX == 1 && tempValY == 1) {
                    fren['curPos'].x = fren['curPos'].x
                    fren['curPos'].y = fren['curPos'].y
                    fren['targetPos'].x = parseInt((Math.random() * (39 - 1) + 1).toFixed(0));
                    fren['targetPos'].y = parseInt((Math.random() * (15 - 1) + 1).toFixed(0));
                }
            }
        })
    })

    const updateTempBuildMesh = (currBlockPos : Vector2) => {
        var blockRightPos = new Vector2;
        blockRightPos.x = currBlockPos.x;
        blockRightPos.y = currBlockPos.y;

        if (checkFree(blockRightPos, tempBuildMeshSize) == 1)
        {
            setSpaceValid(1)
            setTempBuildMeshTexture(1)
        }
        else if (checkFree(blockRightPos, tempBuildMeshSize) == 0)
        {
            setSpaceValid(0)
            setTempBuildMeshTexture(0)
        }

        // BUILD
        if (mouseLeftPressed == 1 && spaceValid == 1 && placementActive == 1) // NEED TO DO IT WITH RIGHT CLICK
        {
            var pos = new Vector2;
            pos.x = tempBuildMesh.x;
            pos.y = tempBuildMesh.z;

            console.log('create building on Map', frameData?.id)
            // Update frontBlockArray to update mesh on map
            frontBlockArray[pos.y][pos.x - 0.5][3] = frameData?.id
            frontBlockArray[pos.y][pos.x - 0.5][4] = UBlockIDs + 1
            frontBlockArray[pos.y][pos.x - 0.5][10] = 1

            // TEST
            frontBlockArray[pos.y][pos.x - 0.5][10] = 0 // status : building
            buildTx(UBlockIDs + 1, frameData?.id as number, pos.x - 0.5, pos.y)
            // END TEST

            // Update global variables
            setUBlockIDs(UBlockIDs + 1)
            setPlacementActive(0)
        }
        if (mouseMiddlePressed == 1 && placementActive == 1) // NEED TO TEST THE KEY
        {
            updateBuildingFrame(false, {"id": selectedObj?.type_id, "unique_id": selectedObj?.unique_id, "posX": selectedObj?.pos?.x, "posY": selectedObj?.pos?.y, "selected": 0});
            setPlacementActive(0);
        }
    }

    const checkFree = (pos : THREE.Vector2, numB : number) => {
        if (pos.x >= 1 && pos.x <= 40 && pos.y >= 1 && pos.y <= 16) {
            if (numB == 1) {
                if (frontBlockArray[pos.y][pos.x][3] != null && frontBlockArray[pos.y][pos.x][3] == 0)
                {
                return (1);
                }
            }
            else if (numB == 2) {
                if (frontBlockArray[pos.y][pos.x][3] != null && frontBlockArray[pos.y][pos.x][3] == 0
                && frontBlockArray[pos.y][pos.x + 1] != null && frontBlockArray[pos.y][pos.x + 1][3] == 0)
                {
                    return (1);
                }
            }
            else if (pos.y - 1 != 0 && numB == 4) {
                if (frontBlockArray[pos.y][pos.x] != null && frontBlockArray[pos.y][pos.x][3] == 0
                && frontBlockArray[pos.y][pos.x + 1] != null && frontBlockArray[pos.y][pos.x + 1][3] == 0
                && frontBlockArray[pos.y - 1][pos.x] != null && frontBlockArray[pos.y - 1][pos.x][3] == 0
                && frontBlockArray[pos.y - 1][pos.x + 1] != null && frontBlockArray[pos.y - 1][pos.x + 1][3] == 0
                ) {
                    return (1);
                }
            }
        }
        return (0);
    }

    const generateBuild = useBuild()

    const buildTx = async (uniqueId : number, typeId : number, posX: number, posY: number) => {
        if (account && tokenId) {
            const pos_start : number = (posY - 1) * 40 + posX
            let tx_hash = await generateBuild(tokenId, typeId, 1, pos_start, posX, posY, uniqueId, nonceValue)
            console.log('tx hash', tx_hash)

            if (tx_hash == 0) {
                // In case tx rejected
                frontBlockArray[posY][posX][3] = 0
                frontBlockArray[posY][posX][4] = 0
                frontBlockArray[posY][posX][10] = 0
                setUBlockIDs(UBlockIDs - 1)
            } else {
                updateNonce(nonceValue)
            }
        }
    };

    useEffect(() => {
        // HANDLE ACCEPTED TX
        const txList = transactions.filter(
            (tx) => tx.status == 'ACCEPTED_ON_L2'
          )
        if (txList) {
            txList.map((tx) => {
                // console.log('tx map', tx)

                if (tx.status == 'ACCEPTED_ON_L2' && tx.metadata.posY && tx.metadata.posX) {
                    let _txExists : {} = {};
                    if (Object.keys(frontBlockArray[tx.metadata.posY][tx.metadata.posX][11]).length > 0) {
                        _txExists = frontBlockArray[tx.metadata.posY][tx.metadata.posX][11].includes(tx.transactionHash)
                    }

                    if (Object.keys(frontBlockArray[tx.metadata.posY][tx.metadata.posX][11]).length == 0 || !_txExists) {
                        frontBlockArray[tx.metadata.posY][tx.metadata.posX][11].push(tx.transactionHash)

                        if (tx.metadata.method == 'build') {
                            if (frontBlockArray[tx.metadata.posY][tx.metadata.posX] && frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] == 0 ) {
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                            }
                        } else if (tx.metadata.method == 'harvest_resources') {
                            setHarvesting(tx.metadata.posX, tx.metadata.posY, 1)
                            if (frontBlockArray[tx.metadata.posY][tx.metadata.posX][7] == 3) {
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][3] = 0
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][4] = 0
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][7] = 1
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][9] = 0
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                            } else {
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][7] += 1
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                            }
                        } else if (tx.metadata.method == 'destroy_building') {
                            setHarvesting(tx.metadata.posX, tx.metadata.posY, 1)
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][3] = 0
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][4] = 0
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][7] = 1
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][9] = 0
                        } else if (tx.metadata.method == 'upgrade') {
                            setHarvesting(tx.metadata.posX, tx.metadata.posY, 1)
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][7] += 1
                        }
                    }
                }
            })
        }

        // HANDLE REJECTED TX
        const rejectedTxList = transactions.filter(
            (tx) => tx.status == 'REJECTED'
          )
        if (rejectedTxList) {
            txList.map((tx) => {
                // TX for upgrades
                if (tx.status == 'REJECTED') {

                    let _txExists : {} = {};
                    if (Object.keys(frontBlockArray[tx.metadata.posY][tx.metadata.posX][11]).length > 0) {
                        _txExists = frontBlockArray[tx.metadata.posY][tx.metadata.posX][11].includes(tx.transactionHash)
                    }

                    if (Object.keys(frontBlockArray[tx.metadata.posY][tx.metadata.posX][11]).length == 0 || !_txExists) {
                        frontBlockArray[tx.metadata.posY][tx.metadata.posX][11].push(tx.transactionHash)

                        if (tx.metadata.method == 'build') {
                            if (frontBlockArray[tx.metadata.posY][tx.metadata.posX] && frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] == 0 ) {
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][3] = 0
                                frontBlockArray[tx.metadata.posY][tx.metadata.posX][4] = 0
                            }
                        } else if (tx.metadata.method == 'harvest_resources') {
                            setHarvesting(tx.metadata.posX, tx.metadata.posY, 1)
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                        } else if (tx.metadata.method == 'destroy_building') {
                            setHarvesting(tx.metadata.posX, tx.metadata.posY, 1)
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                        } else if (tx.metadata.method == 'upgrade') {
                            setHarvesting(tx.metadata.posX, tx.metadata.posY, 1)
                            frontBlockArray[tx.metadata.posY][tx.metadata.posX][10] = 1
                        }
                    }
                }
            })
        }

    }, [transactions])


    // Load Frens texture
    const frenTexture = useMemo(() => {
        if (textArrRef && textArrRef.length > 0) {
            let textObj;
            if (worldType == 1) {
                textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_1.png");
            } else if (worldType == 2) {
                textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_2.png");
            } else if (worldType == 3) {
                textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_3.png");
            } else {
                textObj = new TextureLoader().load("resources/textures/Matchbox_Tiles_Objects_nogrid_0.png");
            }
            // textureType = findTextByID(193);
            textObj.offset.set(0, 0.1875)
            textObj.repeat = new Vector2(0.0625, 0.0625)
            textObj.magFilter = NearestFilter;
            textObj.wrapS = RepeatWrapping;
            textObj.wrapT = RepeatWrapping;

            return textObj
        }
    }, [textArrRef])

    return(
        <>
            { textArrRef && textArrRef.length > 0 && frontBlockArray && Object.keys(frontBlockArray).length > 0 &&
                <Resources
                    frontBlockArray={frontBlockArray}
                    textArrRef={textArrRef}
                    rightBuildingType={rightBuildingType}
                    position={currBlockPosState}
                    worldType={worldType}
                    animIndex={animIndex}
                />
            }

            {frameDataValue && frameDataValue.id != 0 && frameDataValue.selected == 1 && placementActive == 1 &&
                <BuildingTemp
                    frontBlockArray={frontBlockArray}
                    type={frameDataValue.id}
                    name={9898}
                    rightBuildingType={rightBuildingType}
                    textArrRef={textArrRef}
                    size={1}
                    id={UBlockIDs}
                    spaceValid={spaceValid}
                    position={tempBuildMesh}
                />
            }

            {frensArray && Object.keys(frensArray).length > 0 && frensArray.map((fren : any, index: number) => {
                return <Frens key={index} frenIndex={index} fren={fren} frenPosition={1} frenTexture={frenTexture} />
            })}
        </>
    )



}

import React, { useEffect, useState, useMemo } from "react";
import { SceneSimple } from '../../components/Gallery/SceneSimple'
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";
import { useWorldsContract } from "../../hooks/contracts/worlds";
import { allMetadata } from "../../data/metadata";

export default function GalleryItem(props: any) {
    const { tokenId } = props

    const { contract: worlds } = useWorldsContract();
    const [worldType, setWorldType] = useState(-1)
    const [mapArray, setMapArray] = useState<any[]>([])

    const rightBuildingType : any[] = [0, 1, 179, 15, 3, 10, 5, 8, 7, 6, 59, 11, 9, 12, 13, 60, 36, 58, 61, 4, 20, 14, 33, 57, 100, 20, 24, 183]
    const [textArrRef, setTextArrRef] = useState<any[]>([])
    const [UBlockIDs, setUBlockIDs] = useState(0);
    const [buildingCounters, setBuildingCounters] = useState<any[]>([])
    const [level, setLevel] = useState(1);

    useEffect(() => {
        if (tokenId) {
          let _metadata = allMetadata.filter(res => res.id == tokenId as any )
          setWorldType(_metadata[0].biome)
          console.log('_metadata[0].biome', _metadata[0].biome)
        }
    }, [tokenId])

    useEffect(() => {
        if (tokenId) {
            fetchMapArray(tokenId).then((res) => {
                console.log('res', res)
                if (res?.frontArray)
                    setMapArray(res.frontArray)
            })
        }
    }, [tokenId])

    async function fetchMapArray(tokenId: any) {
        let _mapArray : any[] = [];

        if (worlds && tokenId) {
            try {
                var elem = await worlds.call("get_map_array", [uint256.bnToUint256(tokenId)]);
                var i = 0
                var counters : any[] = [];
                elem.forEach((_map : any) => {
                    while (i < 640) {
                      var elem = toBN(_map[i])
                      _mapArray.push(elem.toString())
                      if (elem.toString().length < 16) {
                        var type_id = parseInt(elem.toString()[4] + elem.toString()[5])
                        if (type_id == 2 || type_id == 3 || type_id == 20 || type_id == 27) {
                          if (counters[type_id]) {
                            counters[type_id] += 1
                          } else {
                            counters[type_id] = 1
                          }
                        }
                      } else {
                        var type_id = parseInt(elem.toString()[5] + elem.toString()[6])
                        if (type_id == 2 || type_id == 3 || type_id == 20 || type_id == 27) {
                          if (counters[type_id]) {
                            counters[type_id] += 1
                          } else {
                            counters[type_id] = 1
                          }
                        }
                      }
                      i++;
                    }
                  })
                  console.log('counters', counters)

                  var frontArray = frontBlockArray(_mapArray)
        
                console.log('frontArray', frontArray)
                return frontArray
            } catch (e) {
                console.warn("Error when retrieving get_map_array in M01_Worlds");
                console.warn(e);
            }
            
        }
    }

    useEffect(() => {
        var x = 0;
        var y = 15;
        var value = 1;
        let textArrRefTemp : any[] = []
    
        while (y >= 0)
        {
            textArrRefTemp[y] = [];
            while (x < 16)
            {
                textArrRefTemp[y][x] = value;
                x++;
                value++;
            }
            x = 0;
            y--;
        }
        setTextArrRef(textArrRefTemp)
    }, [])

    const frontBlockArray = (_mapArray : any) => {
        console.log('frontBlockArray')
        if (_mapArray && Object.keys(_mapArray).length > 0) {
            console.log('mapArray')
          var frontArray: any[] = [];
          // Decompose array
          var indexI = 1;
          var indexJ = 1;
          var i = 0;
          var buildingIDs = 0;
    
          var counters : any[] = []
    
          while (indexI < 17)
          {
            frontArray[indexI] = [];
    
            while (indexJ < 41)
            {
    
              frontArray[indexI][indexJ] = decompose(_mapArray[i]);
              if (frontArray[indexI][indexJ][4] != 0) buildingIDs++;
    
              if (frontArray[indexI][indexJ] && frontArray[indexI][indexJ][3] && frontArray[indexI][indexJ][3] > 0) {
                let currCounter = 0;
                if (counters[frontArray[indexI][indexJ][3]] > 0) currCounter = counters[frontArray[indexI][indexJ][3]]
    
                if (frontArray[indexI][indexJ][3] == 2 || frontArray[indexI][indexJ][3] == 3 || frontArray[indexI][indexJ][3] == 20) {
                  counters[frontArray[indexI][indexJ][3]] = currCounter + (4 - frontArray[indexI][indexJ][7])
                } else {
                  counters[frontArray[indexI][indexJ][3]] = currCounter + 1
                }
              }
    
              indexJ++;
              i++;
            }
            indexJ = 1;
            indexI++;
            }
            setUBlockIDs(buildingIDs)
            setBuildingCounters(counters)

            console.log('frontArray', frontArray)
    
            return { frontArray }
        }
    }

    function decompose(elem: any)
    {
        var tempDecomp : any[] = [];

        if (elem.length < 16)
        {
            tempDecomp[0] = parseInt(elem[0]);                      //[pos:x]
            tempDecomp[1] = parseInt(elem[1] + elem[2]);            //[pos:y]
            tempDecomp[2] = parseInt(elem[3]);                      //[mat type]
            tempDecomp[3] = parseInt(elem[4] + elem[5]);            //[ress or bat type]  + 900 pour avoir 999 max
            tempDecomp[4] = parseInt(elem[6] + elem[7] + elem[8]);  //[UNIQUE ID]
            tempDecomp[5] = parseInt(elem[9] + elem[10]);           //[health]
            tempDecomp[6] = parseInt(elem[11] + elem[12]);          //[quantity ress or pop + 900 pour avoir 999 ???
            tempDecomp[7] = parseInt(elem[13]);                     //[current level]
            tempDecomp[8] = parseInt(elem[14]);                     //[size]
            tempDecomp[9] = 0;                                      //[random ID]
            tempDecomp[10] = 1                                      // Local: Status of building (1 = built, 0 = en construction)
            tempDecomp[11] = []                                     // last tx hash
        }
        else
        {
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
            tempDecomp[10] = 1                                      // Local : Status of building (1 = built, 0 = en construction // 1= not harvested, 0 = currently harvested)
            tempDecomp[11] = []                                     // last tx hash
        }

        if (tempDecomp[3] == 2 || tempDecomp[3] == 3)
        {
        tempDecomp[9] = parseInt((Math.random() * (3 - 1) + 1).toFixed(0));
        }

        return (tempDecomp);
    }
    

    return (
        <>
        {mapArray != undefined && mapArray && Object.keys(mapArray).length > 0 ? (
            <>
                <p>Map #{tokenId}</p>
                <div style={{ height: "100vh", width: "100vw", zIndex: "0" }}>
                        {mapArray && Object.keys(mapArray).length > 0 &&
                        worldType != null && worldType != -1 &&
                            <SceneSimple
                                mapArray={mapArray}
                                textArrRef={textArrRef}
                                rightBuildingType={rightBuildingType}
                                worldType={worldType}
                                UBlockIDs={UBlockIDs}
                            />
                        }
                </div>
            </>
        ) : (
            <div style={{backgroundColor: "rgb(21, 29, 40)", width: "100vw", height: "100vh"}}>
              <img src="../resources/front/LoadingScreen.gif" className="mx-auto my-auto" />
            </div>
        )}
        </>
    );
}

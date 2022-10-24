import React from "react";
import { useNewGameContext } from "../../hooks/useNewGameContext";

export function TransactionItem(props: any) {
  const { index, entrypoint, calldata, status, initialMap } = props;
  const { staticResources, fullMap, staticBuildings } = useNewGameContext();

  return (
    <>
      <div className="flex flex-row">
        <div>
          <p>
            {entrypoint == "harvest" && (
              <>
                #{index} : <span className="capitalize">{entrypoint}</span>
                <span>
                  {" "}
                  {
                    staticResources[
                      initialMap[parseInt(calldata[3])][parseInt(calldata[2])]
                        .randType - 1
                    ].name
                  }
                </span>
                <span>
                  ({parseInt(calldata[2])}, {parseInt(calldata[3])})
                </span>
                <span>status: {status}</span>
              </>
            )}
            {entrypoint == "build" && (
              <>
                #{index} : <span className="capitalize">{entrypoint}</span>
                <span> {staticBuildings[parseInt(calldata[4]) - 1].name}</span>
                <span>
                  ({parseInt(calldata[2])}, {parseInt(calldata[3])})
                </span>
                <span>status: {status}</span>
              </>
            )}
            {entrypoint == "start_game" && (
              <>
                #{index} : <span className="capitalize">Initialize game</span>
                <span> status: {status}</span>
              </>
            )}
            {entrypoint == "destroy_building" && (
              <>
                #{index} : <span className="capitalize">Destroy building</span>
                <span> status: {status}</span>
              </>
            )}
            {entrypoint == "repair_building" && (
              <>
                #{index} : <span className="capitalize">Repair building</span>
                <span> status: {status}</span>
              </>
            )}
            {entrypoint == "move_infrastructure" && (
              <>
                #{index} : <span className="capitalize">Move building</span>
                <span> status: {status}</span>
              </>
            )}
            {entrypoint == "fuel_building_production" && (
              <>
                #{index} :{" "}
                <span>
                  Fuel production of{" "}
                  {
                    staticBuildings[
                      fullMap[parseInt(calldata[3])][parseInt(calldata[2])]
                        .type - 1
                    ].name
                  }{" "}
                  for {calldata[4]} cycles
                </span>
                <span>
                  ({parseInt(calldata[2])}, {parseInt(calldata[3])})
                </span>
                <span> status: {status}</span>
                <span className="fontRed">!</span>
              </>
            )}
            {entrypoint == "claim_production" && (
              <>
                #{index} : <span className="capitalize">Claim production</span>
                <span> status: {status}</span>
              </>
            )}
            {entrypoint == "reinit_game" && (
              <>
                #{index} : <span className="capitalize">Reinitialize game</span>
                <span> status: {status}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

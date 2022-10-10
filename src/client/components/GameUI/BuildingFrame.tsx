import React, { useMemo, useState, useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { useSelectContext } from "../../hooks/useSelectContext";
import { useNewGameContext } from "../../hooks/useNewGameContext";
import {
  checkResHarvestMsg,
  checkResBuildMsg,
  checkResRepairMsg,
} from "../../utils/building";
import { BF_resource } from "./Frame/BF_resource";
import { BF_noID } from "./Frame/BF_noID";
import { BF_upgrade } from "./Frame/BF_upgrade";
import { BF_maintain } from "./Frame/BF_maintain";

export function BuildingFrame(props: any) {
  const { tokenId, setAddress, updateTokenId } = useGameContext();

  const {
    addAction,
    payloadActions,
    wallet,
    inventory,
    staticBuildings,
    staticResources,
    fullMap,
    playerBuilding,
  } = useNewGameContext();

  const ResArrCorresp = [
    "wood",
    "rock",
    "food",
    "metal",
    "coal",
    "energy",
    "coin",
    "gold",
    "frens",
  ];

  const { showFrame, frameData } = useSelectContext();
  const [msg, setMsg] = useState("");
  const [canHarvest, setCanHarvest] = useState(1);
  const [canBuild, setCanBuild] = useState(1);
  const [canRepair, setCanRepair] = useState(1);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showFrame) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [show, showFrame, frameData]);

  // const nonceValue = useMemo(() => {
  //   console.log("new nonce value", nonce);
  //   return nonce;
  // }, [nonce]);

  const frameDataValue = useMemo(() => {
    return frameData;
  }, [frameData]);

  useEffect(() => {
    if (wallet && wallet.isConnected) {
      setAddress(wallet.account.address);
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet.isConnected && !tokenId) {
      updateTokenId(wallet.account.address);
    }
  }, [wallet, tokenId]);

  const buildErrorMsg = (resArr: [], name: string) => {
    let _msg = "";
    _msg += "Not enough ";
    let i = 0;

    while (i < resArr.length) {
      _msg += ResArrCorresp[resArr[i]];
      if (i == resArr.length - 2) {
        _msg += " & ";
      } else if (i < resArr.length - 2) {
        _msg += ", ";
      }
      i++;
    }
    _msg += " to " + name + ".";

    return _msg;
  };

  // Update costs/production for focused infrastructure in building frame
  useEffect(() => {
    if (frameData != null && frameData.infraType && frameData.typeId) {
      let _msg = "";

      if (frameData.infraType == 1) {
        // * Check can harvest resource
        const _canHarvest = checkResHarvestMsg(
          frameData.typeId,
          inventory,
          staticResources
        );

        if (_canHarvest.length > 0) {
          setCanHarvest(0);
          _msg = buildErrorMsg(_canHarvest, "harvest");
        } else {
          setCanHarvest(1);
        }

        setMsg(_msg);
      } else if (frameData.infraType == 2) {
        if (!frameData.unique_id) {
          // * Check can build building
          const _canBuild = checkResBuildMsg(
            frameData.typeId - 1,
            inventory,
            staticBuildings
          );

          if (_canBuild.length > 0) {
            setCanBuild(0);
            _msg = buildErrorMsg(_canBuild, "build");
            setMsg(_msg);
          } else {
            setCanBuild(1);
          }
        } else if (
          frameData.unique_id &&
          !staticBuildings[frameData.typeId - 1].needMaintain
        ) {
          // * Case building qui ne produit pas déjà construit

          // TODO ajouter une condition pour check si decay et besoin de le calculer
          if (frameData.typeId == 1) {
            const _canRepair = checkResRepairMsg(
              frameData.typeId - 1,
              inventory,
              staticBuildings
            );

            if (_canRepair.length > 0) {
              setCanRepair(0);
              _msg = buildErrorMsg(_canRepair, "repair");
              setMsg(_msg);
            } else {
              setCanRepair(1);
            }
          }
        }
        setMsg(_msg);
      }
    }
  }, [frameData]);

  if (!showFrame) {
    return <></>;
  }
  if (frameData?.typeId == 0) {
    return <></>;
  }

  console.log("frameData", frameData);

  return (
    <>
      {frameDataValue != null && frameDataValue.infraType == 1 && (
        <>
          <BF_resource
            uid={frameDataValue.unique_id}
            typeId={frameDataValue.typeId}
            randType={frameDataValue.randType}
            state={fullMap[frameDataValue.posY][frameDataValue.posX].state}
            posX={frameDataValue.posX}
            posY={frameDataValue.posY}
            _canHarvest={canHarvest}
            _msg={msg}
            staticResourcesData={staticResources}
            inventory={inventory}
          />
        </>
      )}

      {frameDataValue != null &&
        frameDataValue.infraType == 2 &&
        !frameDataValue.unique_id && (
          <>
            <BF_noID
              typeId={frameDataValue.typeId}
              state={frameDataValue.state}
              _canBuild={canBuild}
              _msg={msg}
              staticBuildingsData={staticBuildings}
              inventory={inventory}
            />
          </>
        )}

      {frameDataValue != null &&
        frameDataValue.infraType == 2 &&
        frameDataValue?.typeId &&
        frameDataValue.unique_id &&
        !staticBuildings[frameDataValue.typeId - 1].needMaintain && (
          <>
            <BF_upgrade
              typeId={frameDataValue.typeId}
              state={frameDataValue.state}
              posX={frameDataValue.posX}
              posY={frameDataValue.posY}
              // ! get decay from player building array
              decay={100}
              _canRepair={canRepair}
              _msg={msg}
              staticBuildingsData={staticBuildings}
              inventory={inventory}
            />
          </>
        )}

      {frameDataValue != null &&
        frameDataValue?.infraType == 2 &&
        frameDataValue?.typeId &&
        frameDataValue.unique_id &&
        staticBuildings[frameDataValue.typeId - 1].needMaintain && (
          <>
            <BF_maintain
              uid={frameData?.unique_id}
              typeId={frameDataValue.typeId}
              state={frameDataValue.state}
              posX={frameDataValue.posX}
              posY={frameDataValue.posY}
              staticBuildingsData={staticBuildings}
              inventory={inventory}
            />
          </>
        )}
    </>
  );
}

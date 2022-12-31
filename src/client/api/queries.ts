import { gql } from "@apollo/client";

export const TOKENS_QUERY = gql`
  query tokens($owner: HexValue) {
    tokens(owner: $owner) {
      tokenId
      owner
    }
  }
`;

export const INIT_QUERY = gql`
  query wasInit($landId: HexValue!) {
    wasInit(landId: $landId)
  }
`;

export const BUILDINGS_QUERY = gql`
  query getBuildingsState($landId: HexValue, $limit: Int, $skip: Int) {
    getBuildingsState(landId: $landId, limit: $limit, skip: $skip) {
      blockComp
      posY
      posX
      buildingUid
      buildingTypeId
      time
      status
      decay
      activeCycles
      incomingCycles
      lastFuel
    }
  }
`;

export const RESET_QUERY = gql`
  query reset($landId: HexValue!, $limit: Int, $skip: Int) {
    reset(landId: $landId, limit: $limit, skip: $skip) {
      owner
      landId
      time
      timestamp
    }
  }
`;

export const MAP_QUERY = gql`
  query getLand($landId: HexValue!) {
    getLand(landId: $landId) {
      map
      landId
      timestamp
      time
    }
  }
`;

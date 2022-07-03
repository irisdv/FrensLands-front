import React, { useEffect, useContext, useState } from "react";
import Scene from "../three/Scene";
import { useStarknet } from "@starknet-react/core";

export default function Game() {
  const { account } = useStarknet();
  const [render, setRender] = useState(true);

  return <>{render ? <Scene /> : <p>Loading socket</p>}</>;
}

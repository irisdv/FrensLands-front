import React, { useEffect, useState, useMemo } from 'react'
import Scene from '../three/Scene'
import { useStarknet, useStarknetCall } from '@starknet-react/core'
import useInGameContext from '../hooks/useInGameContext'
import { useSelectContext } from '../hooks/useSelectContext'
import { useBuildingsContract } from '../hooks/contracts/buildings'
import { number, uint256 } from 'starknet'
import { toBN } from 'starknet/dist/utils/number'
import GalleryList from '../components/Gallery/GalleryList'
import { Outlet } from 'react-router-dom'

export default function Gallery () {
  const { account } = useStarknet()
  // const { contract: building } = useBuildingsContract();
  // const [render, setRender] = useState(true);

  const gameArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  console.log('TEST')

  return (
    <>
      <p>Gallery</p>
      {gameArr.map((elem) => {
        return <GalleryList elem={elem} key={elem} />
      })}
    </>
  )
}

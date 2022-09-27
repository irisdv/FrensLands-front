import React from 'react'
import { Link } from 'react-router-dom'

export default function GalleryList (props: any) {
  const { elem } = props

  console.log('elem', elem)

  return (
    <>
      <div>
        <p>Map #{elem}</p>
        <Link to={`/gallery/${elem}`} state={{ tokenId: elem }}>
          Check map
        </Link>
      </div>
    </>
  )
}

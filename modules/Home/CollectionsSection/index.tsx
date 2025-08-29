import React from 'react'
import Collection from '../Collection'

const CollectionsSection = ({regionId}: {regionId: string}) => {
  const collections = [
    {
      handle: "men"
    },
    {
      handle: "women"
    },
    {
      handle: "kids"
    }
  ]
  return (
    <div>
      {collections.map((collection) => {
        return (
          <Collection key={collection.handle} region_id={regionId} handle={collection.handle} />
        )
      })}
    </div>
  )
}

export default CollectionsSection

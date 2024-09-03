// components/StreamList.tsx

import { Key, use, useEffect } from "react"
import { StreamCard } from "./streamCard"

export const StreamList = ({ streams }: { streams: Array<any> }) => {
  useEffect(() => {
    console.log("streams", streams)
  }, [streams])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.map((stream: { id: Key | null | undefined }) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  )
}

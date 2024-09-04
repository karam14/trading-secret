import { Key, useEffect } from "react";
import { StreamCard } from "./streamCard";
import { VideoOff } from "lucide-react"; // Assuming lucide-react for the icon, you can replace it with your preferred icon library

export const StreamList = ({ streams }: { streams: Array<any> }) => {
  useEffect(() => {
    console.log("streams", streams);
  }, [streams]);

  if (streams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full text-center text-gray-500 dark:text-gray-400">
        <VideoOff name="VideoOff" className="w-16 h-16 mb-4" /> {/* Replace "VideoOff" with your preferred icon */}
        <p className="text-lg">لا توجد بثوث مباشرة في الوقت الحالي</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.map((stream: { id: Key | null | undefined }) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
};

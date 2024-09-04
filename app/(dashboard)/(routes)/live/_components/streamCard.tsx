import React from "react"
import { Card, CardContent } from "@/components/ui/card"
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';
import { Radio } from "lucide-react"
import { cn } from "@/lib/utils";

export const StreamCard = ({ stream }: { stream: any }) => {
  const router = useRouter();

  const handleCardClick = () => {
    // Redirect to the stream's page (assuming there's a dynamic route for stream details)
    router.push(`/live/${stream.id}`);
  };

  return (
    <Card 
      className="bg-gray-800 border-gray-700 relative cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">{stream.title}</h3>
          {stream.is_live && (
            <div className={cn("text-red-500 animate-pulse")}>
              <Radio className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="aspect-video bg-gray-700 mb-4">
          <img 
            src={stream.profile_view.image_url} 
            alt={stream.title} 
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-gray-300 mb-4">{stream.description}</p>
        <p className="text-sm text-gray-400">Host: {stream.profile_view.name}</p>
      </CardContent>
    </Card>
  );
};

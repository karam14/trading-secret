'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { VideoIcon, MicIcon } from 'lucide-react';

export default function GoLiveForm() {
  const [streamType, setStreamType] = useState('voice-video'); // State to manage selected stream type

  const handleGoLive = async () => {
    // Implement go live logic here
  };

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Go Live</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="live-title" className="text-gray-600 dark:text-gray-300">Stream Title</Label>
          <Input
            id="live-title"
            placeholder="Enter stream title"
            className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="live-description" className="text-gray-600 dark:text-gray-300">Description</Label>
          <Textarea
            id="live-description"
            placeholder="Enter stream description"
            className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-gray-300">Stream Type</Label>
          <RadioGroup
            value={streamType}
            onValueChange={(value) => setStreamType(value)} // Update streamType state
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="voice-only" id="live-voice-only" />
              <Label htmlFor="live-voice-only" className="text-gray-600 dark:text-gray-300">Voice Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="voice-video" id="live-voice-video" />
              <Label htmlFor="live-voice-video" className="text-gray-600 dark:text-gray-300">Voice and Video</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center justify-center w-full">
          <Button className="w-44 mt-10 flex justify-evenly" onClick={handleGoLive}>
            <span>Go Live Now</span>
            {streamType === 'voice-video' ? (
              <VideoIcon className="text-red-400" size={24} />
            ) : (
              <MicIcon className="text-red-400" size={24} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

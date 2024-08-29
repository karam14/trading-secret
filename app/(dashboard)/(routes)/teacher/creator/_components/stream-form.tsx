'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon } from 'lucide-react';
import { scheduleStream } from '@/actions/schedule-stream'; // Import the action
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function StreamForm() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("voice-video");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const stream = { title, description, date, type };
    
    try {
      await scheduleStream(stream); // Call action to schedule stream
      toast.success('Stream scheduled successfully!');
      setTitle("");
      setDescription("");
      setDate("");
      setType("voice-video");
      router.refresh(); // Refresh the page to show the new stream
      
    } catch (error) {
      console.error(error);
      toast.error(`Failed to schedule stream. ${error}`);
    }
  };

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Schedule Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stream-title" className="text-gray-600 dark:text-gray-300">Stream Title</Label>
            <Input
              id="stream-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter stream title"
              required
              className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-description" className="text-gray-600 dark:text-gray-300">Description</Label>
            <Textarea
              id="stream-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter stream description"
              required
              className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-date" className="text-gray-600 dark:text-gray-300">Date and Time</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="stream-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 dark:text-gray-300">Stream Type</Label>
            <RadioGroup value={type} onValueChange={setType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="voice-only" id="voice-only" />
                <Label htmlFor="voice-only" className="text-gray-600 dark:text-gray-300">Voice Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="voice-video" id="voice-video" />
                <Label htmlFor="voice-video" className="text-gray-600 dark:text-gray-300">Voice and Video</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-center w-full ">
            <Button type='submit' className="w-44 mt-5 flex justify-evenly">
              Schedule Stream
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

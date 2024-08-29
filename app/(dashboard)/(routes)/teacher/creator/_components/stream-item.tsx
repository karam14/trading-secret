'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Save, X, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MicIcon, VideoIcon } from 'lucide-react';
import { deleteStream, modifyStream } from '@/actions/schedule-stream';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';

interface StreamItemProps {
  stream: {
    id: UUID;
    title: string;
    date: string;
    description: string;
    type: string;
  };
}

export default function StreamItem({ stream }: StreamItemProps) {
  const router = useRouter();
  const id = stream.id;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(stream.title);
  const [description, setDescription] = useState(stream.description);
  const [date, setDate] = useState(stream.date);
  const [type, setType] = useState(stream.type);

  const handleModify = async () => {
    try {
      await modifyStream({  id ,title, description, date, type });
      setIsEditing(false); // Exit editing mode
      toast.success('Stream modified successfully!');
      router.refresh();
      
      // Optionally, you can implement a success message or state update here
    } catch (error) {
      toast.error('Failed to modify stream.');
      console.error('Failed to modify stream:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStream(stream.id);
      toast.success('Stream deleted successfully!');
      router.refresh();
      // Optionally, you can implement a success message or state update here
    } catch (error) {
      console.error('Failed to delete stream:', error);
    }
  };

  return (
    <div className="p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Stream Title"
            className="mb-2"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Stream Description"
            className="mb-2"
          />
          <Input
            type="datetime-local"
            value={new Date(date).toISOString().slice(0, 16)}
            onChange={(e) => setDate(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={handleModify}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{stream.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{new Date(stream.date).toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-300">{stream.description}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              {stream.type === 'voice-only' ? (
                <MicIcon className="text-blue-400" size={24} />
              ) : (
                <VideoIcon className="text-green-400" size={24} />
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit size={20} />
              </Button>
              <Button variant="ghost" onClick={handleDelete}>
                <Trash size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
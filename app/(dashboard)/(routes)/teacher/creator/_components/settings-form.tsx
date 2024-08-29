// _components/settings-form.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { updateStreamSettings } from '@/actions/update-stream-settings';
import toast from 'react-hot-toast';

// Define the interface for initialSettings
interface InitialSettings {
  stream_display_name: string;
  bio: string;
  stream_key: string;
  stream_url: string;
}

// Define the props for the SettingsForm component
interface SettingsFormProps {
  initialSettings: InitialSettings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [stream_display_name, setDisplayName] = useState(initialSettings.stream_display_name || '');
  const [bio, setBio] = useState(initialSettings.bio || '');
  const [stream_key, setStreamKey] = useState(initialSettings.stream_key || '');
  const [stream_url, setStreamUrl] = useState(initialSettings.stream_url || '');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [showStreamUrl, setShowStreamUrl] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      await updateStreamSettings( { stream_display_name, bio });
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings.');
    }
  };

  const handleResetStreamKey = async () => {
    const newStreamKey = uuidv4(); // Generate a new stream key
    setStreamKey(newStreamKey);

    try {
      await updateStreamSettings( { stream_display_name, bio, stream_key: newStreamKey });
      alert('Stream key reset successfully!');
    } catch (error) {
      alert('Failed to reset stream key.');
    }
  };
  const handleResetStreamUrl = async () => {
    const newStreamUrl = uuidv4(); // Generate a new stream key
    setStreamUrl(newStreamUrl);

    try {
      await updateStreamSettings( { stream_display_name, bio, stream_url: newStreamUrl });
      alert('Stream URL reset successfully!');
    } catch (error) {
      alert('Failed to reset stream URL.');
    }
  }

  const toggleStreamKeyVisibility = () => {
    setShowStreamKey(!showStreamKey);
  };
  const toggleStreamUrlVisibilty = () => {
    setShowStreamUrl(!showStreamUrl);
  }


  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Stream Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-gray-600 dark:text-gray-300">Stream Display Name</Label>
            <Input
              id="display-name"
              value={stream_display_name}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your stream display name"
              className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-600 dark:text-gray-300">Bio</Label>
            
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your audience about your stream"
              className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-key" className="text-gray-600 dark:text-gray-300">Stream Key</Label>
            <div className="relative flex">
              <Input
                id="stream-key"
                type={showStreamKey ? 'text' : 'password'}
                value={stream_key}
                readOnly
                className="flex-grow bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <Button variant="ghost" type="button" onClick={toggleStreamKeyVisibility} className="ml-2">
                {showStreamKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="softDark" type="button" onClick={handleResetStreamKey} className="ml-2">
                Reset
              </Button>
            </div>

          </div>

          <div className='space-y-2'>
          <Label htmlFor="stream-key" className="text-gray-600 dark:text-gray-300">Stream URL</Label>

          <div className="relative flex">
              <Input
                id="stream-key"
                type={showStreamUrl ? 'text' : 'password'}
                value={stream_url}
                readOnly
                className="flex-grow bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <Button variant="ghost" type="button" onClick={toggleStreamUrlVisibilty} className="ml-2">
                {showStreamKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="softDark" type="button" onClick={handleResetStreamUrl} className="ml-2">
                Reset
              </Button>
            </div>

          </div>

          <div className="flex items-center justify-center w-full">
            <Button className="w-44 mt-10 flex justify-evenly" type='submit'>
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

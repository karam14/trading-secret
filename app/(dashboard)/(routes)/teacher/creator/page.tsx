import StreamForm from './_components/stream-form';
import GoLiveForm from './_components/go-live-form';
import StreamItem from './_components/stream-item';
import SettingsForm from './_components/settings-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStreamSettings } from '@/actions/fetch-stream-settings';
import { fetchUserStreams } from '@/actions/fetch-user-streams';
import getUser from '@/actions/get-user';
import { redirect } from 'next/navigation';


export default async function Home() {
  const {user,error} = await getUser(); // Assuming this action returns the current user
  const userId = user?.id as string;
  if (!userId) {
    // Handle the case where the user is not logged in
    redirect('/login');
  }

  const streams = await fetchUserStreams(userId); // Fetch the streams server-side
  const settings = await fetchStreamSettings(userId); // Fetch the settings server-side

  return (
    <div className={`min-h-screen p-8`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Creator Dashboard</h1>
        </div>
        <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Welcome to your dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">Here you can manage your streams and settings.</p>
          </CardContent>
        </Card>
        <Tabs defaultValue="stream" className="space-y-4">
          <TabsList className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <TabsTrigger value="stream" className="data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Stream</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="stream">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StreamForm />
              <GoLiveForm />
            </div>
            <Card className="mt-8 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Your Scheduled Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {streams.length > 0 ? (
                    streams.map((stream) => (
                      <StreamItem key={stream.id} stream={stream} />
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No streams scheduled.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsForm initialSettings={settings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

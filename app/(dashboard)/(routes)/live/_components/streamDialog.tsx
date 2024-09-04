import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, isSameDay } from "date-fns"
import { ar } from "date-fns/locale"

type Profile = {
  name: string;
};

type Stream = {
  id: string;
  name: string;
  date: Date;
  description: string;
  profiles: Profile[] | Profile;  // Can be an array or a single object
};

export const StreamDialog = ({
  isModalOpen,
  setIsModalOpen,
  selectedDay,
  scheduledStreams,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedDay: Date;
  scheduledStreams: Stream[];
}) => {
  // Helper function to get the name from profiles
  const getHostName = (profiles: Profile[] | Profile) => {
    if (Array.isArray(profiles)) {
      return profiles.length > 0 ? profiles[0].name : 'مجهول';
    } else if (profiles && typeof profiles === 'object') {
      return profiles.name;
    }
    return 'مجهول';
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-h-[80vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            البثوث ليوم {selectedDay && format(selectedDay, 'd MMMM yyyy', { locale: ar })}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-gray-700 dark:text-gray-300">
          {scheduledStreams
            .filter((stream) => selectedDay && isSameDay(stream.date, selectedDay))
            .map((stream) => (
              <div key={stream.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stream.name}</h3>
                <p><strong>المضيف:</strong> {getHostName(stream.profiles)}</p> {/* Get the host name */}
                <p><strong>الوقت:</strong> {format(stream.date, 'h:mm a', { locale: ar })}</p>
                <p><strong>الوصف:</strong> {stream.description}</p>
              </div>
            ))}
          {(!selectedDay ||
            scheduledStreams.filter(
              (stream) => selectedDay && isSameDay(stream.date, selectedDay)
            ).length === 0) && (
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد بثوث مجدولة لهذا اليوم.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client"

import { useState } from "react"
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, setYear, setMonth, isSameDay, isSameMonth, format } from "date-fns"
import { ar } from 'date-fns/locale'  // Import the Arabic locale
import { StreamList } from "./_components/streamList"
import { Calendar } from "./_components/calendar"
import { StreamDialog } from "./_components/streamDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLiveStreams, useScheduledStreams } from "@/actions/stream-page.actions"
import { Button } from "@/components/ui/button"

type Stream = {
  id: string;
  name: string;
  date: Date;
  description: string;
  profiles: {
    name: any;
  }[];
}

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1))
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day')

  // Use hooks to fetch and subscribe to live data
  const liveStreams = useLiveStreams();
  const scheduledStreams: Stream[] = useScheduledStreams().map(stream => ({
    id: stream.id,
    name: stream.title,
    date: stream.date,
    description: stream.description,
    profiles: stream.profile_view
  }));

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDay(date)
      setIsModalOpen(true)
    }
  }

  const handleHeaderClick = () => {
    if (viewMode === 'day') setViewMode('month')
    else if (viewMode === 'month') setViewMode('year')
    else setViewMode('day')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-8">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">البث المباشر</TabsTrigger>
          <TabsTrigger value="calendar">جدول البث</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <StreamList streams={liveStreams} />
        </TabsContent>
        <TabsContent value="calendar" className="h-[calc(100vh-200px)]">
          <Calendar
            currentDate={currentDate}
            days={days}
            handleDateSelect={handleDateSelect}
            handlePreviousMonth={handlePreviousMonth}
            handleNextMonth={handleNextMonth}
            handleHeaderClick={handleHeaderClick}
            renderDayView={() => {
              return (
                <>
                  <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day) => (
                      <div key={day} className="font-medium text-gray-600 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 flex-grow">
                    {days.map((day) => {
                      const hasStream = scheduledStreams.some(
                        stream => isSameDay(stream.date, day)
                      );
                      return (
                        <Button
                          key={day.toString()}
                          onClick={() => handleDateSelect(day)}
                          variant={hasStream ? "default" : "ghost"}
                          className={`h-16 flex flex-col items-center justify-center ${
                            !isSameMonth(day, currentDate) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                          } ${hasStream ? 'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground hover:bg-primary/90' : ''}`}
                        >
                          <span className="text-lg">{format(day, 'd', { locale: ar })}</span>
                          {hasStream && (
                            <div className="w-1.5 h-1.5 bg-current rounded-full mt-1" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </>
              )
            }}
            renderMonthView={() => {
              return (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        setCurrentDate(setMonth(currentDate, i))
                        setViewMode('day')
                      }}
                      variant="ghost"
                      className="h-16 text-gray-900 dark:text-gray-100"
                    >
                      {format(setMonth(currentDate, i), 'MMM', { locale: ar })}
                    </Button>
                  ))}
                </div>
              )
            }}
            renderYearView={() => {
              return (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        setCurrentDate(setYear(currentDate, currentDate.getFullYear() - 5 + i))
                        setViewMode('month')
                      }}
                      variant="ghost"
                      className="h-16 text-gray-900 dark:text-gray-100"
                    >
                      {currentDate.getFullYear() - 5 + i}
                    </Button>
                  ))}
                </div>
              )
            }}
            viewMode={viewMode}
          />
        </TabsContent>
      </Tabs>
      <StreamDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDay={selectedDay}
        scheduledStreams={scheduledStreams}
      />
    </div>
  );
  
}

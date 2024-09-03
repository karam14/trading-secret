// components/Calendar.tsx

import { ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils";

type CalendarProps = {
    currentDate: Date,
    days: any[],
    handleDateSelect: (date: Date | null) => void,
    handlePreviousMonth: () => void,
    handleNextMonth: () => void,
    handleHeaderClick: () => void,
    renderDayView: () => JSX.Element,
    renderMonthView: () => JSX.Element,
    renderYearView: () => JSX.Element,
    viewMode: string,
  };
  
  export const Calendar = ({
    currentDate,
    days,
    handleDateSelect,
    handlePreviousMonth,
    handleNextMonth,
    handleHeaderClick,
    renderDayView,
    renderMonthView,
    renderYearView,
    viewMode,
  }: CalendarProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePreviousMonth} variant="ghost" size="icon" className="text-gray-100">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button onClick={handleHeaderClick} variant="ghost" className="text-xl font-semibold text-gray-100">
            {viewMode === 'day' && format(currentDate, 'MMMM yyyy')}
            {viewMode === 'month' && format(currentDate, 'yyyy')}
            {viewMode === 'year' && `${currentDate.getFullYear() - 5} - ${currentDate.getFullYear() + 6}`}
          </Button>
          <Button onClick={handleNextMonth} variant="ghost" size="icon"   >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'year' && renderYearView()}
      </CardContent>
    </Card>
  )
}

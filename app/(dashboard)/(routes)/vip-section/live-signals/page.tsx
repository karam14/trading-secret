"use client"

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpIcon, ArrowDownIcon, AlertCircle, CheckCircle2, Clock, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for live signals
const initialSignals = [
  { 
    id: 1, 
    provider: { name: "أحمد محمد", avatar: "/placeholder.svg?height=40&width=40", isSuper: true },
    pair: "EUR/USD", 
    type: "شراء", 
    entryPrice: 1.1850, 
    tp1: 1.1870, 
    tp2: 1.1890, 
    tp3: 1.1910, 
    sl: 1.1820, 
    status: "جديد", 
    timestamp: new Date().getTime(),
    description: "توقع ارتفاع اليورو مقابل الدولار بعد بيانات التضخم الأخيرة."
  },
  { 
    id: 2, 
    provider: { name: "فاطمة علي", avatar: "/placeholder.svg?height=40&width=40", isSuper: false },
    pair: "GOLD", 
    type: "بيع", 
    entryPrice: 1788.50, 
    tp1: 1785.00, 
    tp2: 1782.00, 
    tp3: 1780.00, 
    sl: 1795.00, 
    status: "نشط", 
    timestamp: new Date().getTime() - 300000,
    description: "توقع انخفاض الذهب بسبب ارتفاع عوائد السندات الأمريكية."
  },
  { 
    id: 3, 
    provider: { name: "محمود حسن", avatar: "/placeholder.svg?height=40&width=40", isSuper: false },
    pair: "BTC/USD", 
    type: "شراء", 
    entryPrice: 45000, 
    tp1: 45500, 
    tp2: 46000, 
    tp3: 46500, 
    sl: 44500, 
    status: "مكتمل", 
    timestamp: new Date().getTime() - 900000,
    description: "اختراق مستوى مقاومة هام للبيتكوين."
  },
]

const getStatusBadge = (status: any) => {
  switch (status) {
    case "جديد":
      return <Badge variant="outline"><AlertCircle className="w-3 h-3 ml-1" />جديد</Badge>
    case "نشط":
      return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />نشط</Badge>
    case "مكتمل":
      return <Badge variant="success"><CheckCircle2 className="w-3 h-3 ml-1" />مكتمل</Badge>
    default:
      return null
  }
}

interface Signal {
  id: number;
  provider: {
    name: string;
    avatar: string;
    isSuper: boolean;
  };
  pair: string;
  type: string;
  entryPrice: number;
  tp1: number;
  tp2: number;
  tp3: number;
  sl: number;
  status: string;
  timestamp: number;
  description: string;
}

const SignalBlock = ({ signal }: { signal: Signal }) => (
  <Card className={`mb-4 ${signal.provider.isSuper ? 'border-2 border-yellow-400' : ''}`}>
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="w-12 h-12">
            <AvatarImage src={signal.provider.avatar} alt={signal.provider.name} />
            <AvatarFallback>{signal.provider.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{signal.provider.name}</h3>
              {signal.provider.isSuper && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Star className="w-5 h-5 text-yellow-400 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>مزود إشارات متميز</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{new Date(signal.timestamp).toLocaleString('ar-EG')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-2xl font-bold">{signal.pair}</span>
          <Badge variant={signal.type === "شراء" ? "success" : "destructive"} className="text-lg">
            {signal.type === "شراء" ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />}
            {signal.type}
          </Badge>
          {getStatusBadge(signal.status)}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
        <div>
          <span className="text-sm text-muted-foreground">سعر الدخول</span>
          <p className="font-semibold">{signal.entryPrice}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">وقف الخسارة</span>
          <p className="font-semibold text-red-600">{signal.sl}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">الهدف 1</span>
          <p className="font-semibold text-green-600">{signal.tp1}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">الهدف 2</span>
          <p className="font-semibold text-green-600">{signal.tp2}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">الهدف 3</span>
          <p className="font-semibold text-green-600">{signal.tp3}</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">التفاصيل</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{signal.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function LiveSignals() {
  const [signals, setSignals] = useState(initialSignals)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSignals(currentSignals => {
        const updatedSignals = currentSignals.map(signal => {
          if (signal.status === "جديد") {
            return { ...signal, status: "نشط" }
          } else if (signal.status === "نشط" && Math.random() > 0.7) {
            return { ...signal, status: "مكتمل" }
          }
          return signal
        })

        return updatedSignals
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">الإشارات الحية</h2>
          <Button>تحديث</Button>
        </div>
        <div className="space-y-4">
          {signals.map((signal) => (
            <SignalBlock key={signal.id} signal={signal} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
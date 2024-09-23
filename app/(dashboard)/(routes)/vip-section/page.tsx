import getUser, { getProfile } from "@/actions/get-user";
import { Lock, Trophy, BarChart2, Users, ArrowUpIcon, ArrowDownIcon, AlertCircle, CheckCircle2, Clock, Star, Zap } from "lucide-react";
import { redirect } from 'next/navigation';
import { BannerCard } from "./_components/banner-card";
import LoginButton from "./_components/login-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data for the leaderboard
const leaderboardData = [
  { id: 1, name: "أحمد محمد", avatar: "/placeholder.svg?height=40&width=40", winRatio: 0.75, score: 92 },
  { id: 2, name: "فاطمة علي", avatar: "/placeholder.svg?height=40&width=40", winRatio: 0.72, score: 88 },
  { id: 3, name: "محمود حسن", avatar: "/placeholder.svg?height=40&width=40", winRatio: 0.68, score: 85 },
  { id: 4, name: "نورا أحمد", avatar: "/placeholder.svg?height=40&width=40", winRatio: 0.65, score: 82 },
  { id: 5, name: "خالد عمر", avatar: "/placeholder.svg?height=40&width=40", winRatio: 0.62, score: 79 },
];

// Mock data for live signals
const liveSignalsData = [
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
];

function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>أفضل مزودي إشارات التداول</CardTitle>
        <CardDescription>ترتيب المزودين حسب نسبة الفوز والنقاط</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {leaderboardData.map((provider, index) => (
            <div key={provider.id} className="flex items-center">
              <div className="flex items-center gap-4 flex-1">
                <span className="font-bold text-lg">{index + 1}</span>
                <Avatar>
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback>{provider.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">نسبة الفوز: {(provider.winRatio * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="ml-auto font-bold">{provider.score}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OverallStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إحصائيات عامة</CardTitle>
        <CardDescription>نظرة عامة على أداء مزودي الإشارات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>متوسط نسبة الفوز</span>
              <span className="font-bold">68.4%</span>
            </div>
            <Progress value={68.4} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>متوسط النقاط</span>
              <span className="font-bold">85.2</span>
            </div>
            <Progress value={85.2} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>عدد المزودين النشطين</span>
              <span className="font-bold">42</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const getStatusBadge = (status: string) => {
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
          <span className="text-2xl font-bold pr-3">{signal.pair}</span>
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

function LiveSignals() {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">الإشارات الحية</h2>

        </div>
        <div className="space-y-4">
          {liveSignalsData.map((signal) => (
            <SignalBlock key={signal.id} signal={signal} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default async function VipSection() {
  // Get the authenticated user
  const { user, error } = await getUser();
  
  if (error || !user) {
    return (
      <div className="p-6 space-y-8 text-right">
        <div className="grid grid-cols-1 gap-4">
          <BannerCard
            icon={Lock}
            label="أهلاً بك في قسم VIP"
            description="يرجى تسجيل الدخول للوصول إلى هذه الصفحة."
          />
        </div>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    );
  }

  // Fetch user profile to check VIP status
  const profile = await getProfile(user.id);

  if (!profile || !profile[0]?.vip) {
    return (
      <div className="p-6 space-y-8 text-right">
        <div className="grid grid-cols-1 gap-4">
          <BannerCard
            icon={Lock}
            label="الوصول غير مصرح به"
            description="هذه الصفحة متاحة فقط لأعضاء VIP."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-right">
      {/* <h2 className="text-3xl font-bold text-center">👑 أهلاً بك في قسم VIP 👑</h2>

      <div className="relative p-8 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center text-gray-300 mb-8">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-xl"></div>
        <Lock className="w-16 h-16 text-gray-400 z-10" />
        <p className="text-xl font-semibold mt-4 z-10">مرحباً بك في منطقة VIP الخاصة</p>
        <p className="text-lg mt-2 z-10">استمتع بالوصول الحصري إلى تحليلات المتداولين وإحصائيات الأداء</p>
      </div> */}

      <Tabs defaultValue="live-signals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-signals">
            <Zap className="w-4 h-4 mr-2" />
            الإشارات الحية
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="w-4 h-4 mr-2" />
            المتصدرون
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="w-4 h-4 mr-2" />
            الإحصائيات
          </TabsTrigger>
          <TabsTrigger value="providers">
            <Users className="w-4 h-4 mr-2" />
            جميع المزودين
          </TabsTrigger>
        </TabsList>
        <TabsContent value="live-signals">
          <LiveSignals />
        </TabsContent>
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
        <TabsContent value="stats">
          <OverallStats />
        </TabsContent>
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>جميع مزودي إشارات التداول</CardTitle>
              <CardDescription>قائمة كاملة بجميع مزودي الإشارات المعتمدين</CardDescription>
            </CardHeader>
            <CardContent>
              <p>هذا القسم سيحتوي على قائمة كاملة لجميع مزودي إشارات التداول مع تفاصيل إضافية وخيارات للتصفية والبحث.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
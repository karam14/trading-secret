"use client";
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
import { useEffect, useState } from "react";
import { getLeaderboardData, getLiveSignalsData, getOverallStats, checkVip } from "@/actions/fetch-vip-section-data";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

interface LeaderboardProvider {
  id: string | null;
  name: string | null;
  avatar: string;
  winRatio: number;
  score: number;
}

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardProvider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: LeaderboardProvider[] = await getLeaderboardData();
      setLeaderboardData(data);
    };
    fetchData();
  }, []);

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
                  <AvatarImage src={provider.avatar} alt={provider.name || ''} />
                  <AvatarFallback>
  {provider.name?.split(' ').map(word => word.charAt(0)).join(' ')}
</AvatarFallback>
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

type Signal = Database['public']['Tables']['live_signals']['Row'] & {
  provider: {
    name: string | null;
    avatar: string;
    isSuper: boolean | null;
  };
};

function LiveSignals() {
  const [liveSignalsData, setLiveSignalsData] = useState<Signal[]>([]);

  useEffect(() => {
    getLiveSignalsData().then((data) => {
      setLiveSignalsData(data);
    });
  }, []);

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
  );
}

function OverallStats() {
  const [stats, setStats] = useState({ avgWinRatio: 0, avgScore: 0 });

  useEffect(() => {
    getOverallStats().then((data) => {
      setStats({
        avgWinRatio: Number(data.avgWinRatio),
        avgScore: Number(data.avgScore),
      });
    });
  }, []);

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
              <span className="font-bold">{stats.avgWinRatio}%</span>
            </div>
            <Progress value={stats.avgWinRatio} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>متوسط النقاط</span>
              <span className="font-bold">{stats.avgScore}</span>
            </div>
            <Progress value={stats.avgScore} />
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


// Adjust the SignalBlock component to work with the type
const SignalBlock = ({ signal }: { signal: Signal }) => (
  
  <Card className={`mb-4 ${signal.provider?.isSuper ? 'border-2 border-yellow-400' : ''}`}>
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="w-12 h-12">
            <AvatarImage src={signal.provider?.avatar ?? ''} alt={signal.provider.name || ''} />
            <AvatarFallback>
  {signal.provider?.name?.split(' ').map(word => word.charAt(0)).join(' ')}
</AvatarFallback>          </Avatar>
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
            <p className="text-sm text-muted-foreground">{new Date(signal.timestamp!).toLocaleString('ar-EG')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-2xl font-bold pr-3">{signal.pair}</span>
          <Badge variant={signal.type === "buy" ? "success" : "destructive"} className="text-lg">
            {signal.type === "buy" ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />}
            {signal.type === "buy" ? "شراء" : "بيع"}
          </Badge>
          {getStatusBadge(signal.status)}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
        <div>
          <span className="text-sm text-muted-foreground">سعر الدخول</span>
          <p className="font-semibold">{signal.entry_price}</p>
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
);


export default function VipSection() {
  const [user, setUser] = useState<User | null>(null);
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { user, error } = await getUser();

      if (!error && user) {
        setUser(user);
        console.log(user);

        const vipStatus = await checkVip(user.id);
        setIsVip(vipStatus);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!isVip) {
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
      <Tabs defaultValue="live-signals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-signals">
            <Zap className="w-4 h-4 mr-2" /> الإشارات الحية
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="w-4 h-4 mr-2" /> المتصدرون
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="w-4 h-4 mr-2" /> الإحصائيات
          </TabsTrigger>
          <TabsTrigger value="providers">
            <Users className="w-4 h-4 mr-2" /> جميع المزودين
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
      </Tabs>
    </div>
  );
}
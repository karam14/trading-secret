"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react";

// Mock data for the provider
const providerData = {
  name: "أحمد محمد",
  avatar: "/placeholder.svg?height=128&width=128",
  followers: 1250,
  successRate: 75,
  totalTrades: 500,
  activeTrades: 3,
  revenue: 1200, // New revenue field
};
const messages = [
    {
      id: 1,
      content: "صفقة اليورو/دولار كانت ممتازة، شكراً للإشارة!",
      timestamp: "2023-09-23 10:30",
      reactions: {
        likes: 120,
        thumbsUp: 45,
        thumbsDown: 5,
        heart: 30,
      },
    },
    {
      id: 2,
      content: "هذه الاستراتيجية الجديدة تظهر وعدًا كبيرًا.",
      timestamp: "2023-09-23 11:15",
      reactions: {
        likes: 98,
        thumbsUp: 50,
        thumbsDown: 3,
        heart: 25,
      },
    },
    {
      id: 3,
      content: "صفقة الذهب الأخيرة كانت صعبة، لكننا خرجنا بأرباح جيدة.",
      timestamp: "2023-09-23 12:00",
      reactions: {
        likes: 130,
        thumbsUp: 60,
        thumbsDown: 2,
        heart: 40,
      },
    },
    {
      id: 4,
      content: "هل توافقون على بيع بيتكوين الآن؟",
      timestamp: "2023-09-23 14:45",
      reactions: {
        likes: 80,
        thumbsUp: 30,
        thumbsDown: 15,
        heart: 20,
      },
    },
    {
      id: 5,
      content: "النفط يبدو مستقرًا، فرصة شراء قادمة؟",
      timestamp: "2023-09-23 15:30",
      reactions: {
        likes: 110,
        thumbsUp: 40,
        thumbsDown: 8,
        heart: 35,
      },
    },
  ];
  
// Mock data for recent trades
const recentTrades = [
  {
    id: 1,
    asset: "EUR/USD",
    type: "شراء",
    entryPrice: 1.1850,
    currentPrice: 1.1900,
    profit: 0.42,
    status: "نشط",
    description: "",
  },
  {
    id: 2,
    asset: "GOLD",
    type: "بيع",
    entryPrice: 1788.50,
    currentPrice: 1785.00,
    profit: 0.20,
    status: "نشط",
    description: "",
  },
  {
    id: 3,
    asset: "BTC/USD",
    type: "شراء",
    entryPrice: 45000,
    currentPrice: 46500,
    profit: 3.33,
    status: "نشط",
    description: "",
  },
  {
    id: 4,
    asset: "AAPL",
    type: "بيع",
    entryPrice: 150.25,
    currentPrice: 149.50,
    profit: 0.50,
    status: "مغلق",
    description: "",
  },
  {
    id: 5,
    asset: "EUR/JPY",
    type: "شراء",
    entryPrice: 130.50,
    currentPrice: 130.75,
    profit: 0.19,
    status: "مغلق",
    description: "",
  },
];

export default function ProviderDashboard() {
  const [newSignal, setNewSignal] = useState({
    asset: "",
    type: "شراء",
    entryPrice: "",
    takeProfit: "",
    stopLoss: "",
    description: "",
  });

  const [trades, setTrades] = useState(recentTrades);

  const handleSignalChange = (e: { target: { name: any; value: any; }; }) => {
    setNewSignal({ ...newSignal, [e.target.name]: e.target.value });
  };

  const handleSignalSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  const handleEditTrade = (id: number, field: string, value: string) => {
    setTrades(
      trades.map((trade) =>
        trade.id === id ? { ...trade, [field]: value } : trade
      )
    );
  };

  const handleCloseTrade = (id: number, status: string) => {
    setTrades(
      trades.map((trade) =>
        trade.id === id ? { ...trade, status } : trade
      )
    );
  };

  return (
    <div className="p-6 space-y-8 text-right bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم للمزود</h1>
        <Avatar className="w-16 h-16">
          <AvatarImage src={providerData.avatar} alt={providerData.name} />
          <AvatarFallback>{providerData.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتابعون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerData.followers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة النجاح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerData.successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${providerData.revenue}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="signals">الإشارات</TabsTrigger>
          <TabsTrigger value="followers">المتابعون</TabsTrigger>
          <TabsTrigger value="posts">المنشورات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>نظرة عامة على الأداء</CardTitle>
              <CardDescription>ملخص لنشاطك وأدائك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>نسبة النجاح</span>
                    <span className="font-bold">{providerData.successRate}%</span>
                  </div>
                  <Progress value={providerData.successRate} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>إجمالي الصفقات</span>
                    <span className="font-bold">{providerData.totalTrades}</span>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الأصل</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">سعر الدخول</TableHead>
                      <TableHead className="text-right">السعر الحالي</TableHead>
                      <TableHead className="text-right">الربح %</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.asset}</TableCell>
                        <TableCell>{trade.type}</TableCell>
                        <TableCell>{trade.entryPrice}</TableCell>
                        <TableCell>{trade.currentPrice}</TableCell>
                        <TableCell
                          className={
                            trade.profit > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {trade.profit > 0 ? "+" : ""}
                          {trade.profit}%
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trade.status === "نشط" ? "secondary" : "outline"
                            }
                          >
                            {trade.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={trade.description}
                            onChange={(e) =>
                              handleEditTrade(trade.id, "description", e.target.value)
                            }
                            placeholder="أضف وصفًا..."
                            rows={2}
                            className="bg-gray-800 text-white"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleCloseTrade(trade.id, "مغلق")}
                            variant="outline"
                            size="sm"
                            className="mb-2"
                          >
                            إغلاق
                          </Button>
                          {trade.status === "نشط" && (
                            <>
                              {trade.currentPrice > trade.entryPrice ? (
                                <Button
                                  onClick={() => handleCloseTrade(trade.id, "ربح")}
                                  variant="success"
                                  size="sm"
                                  className="mb-2"
                                >
                                  إغلاق على ربح
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleCloseTrade(trade.id, "خسارة")}
                                  variant="destructive"
                                  size="sm"
                                  className="mb-2"
                                >
                                  إغلاق على خسارة
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الإشارات</CardTitle>
              <CardDescription>إنشاء وإدارة إشارات التداول الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="asset" className="text-sm font-medium">
                      الأصل
                    </label>
                    <Input
                      id="asset"
                      name="asset"
                      value={newSignal.asset}
                      onChange={handleSignalChange}
                      placeholder="مثال: EUR/USD"
                      required
                      className="bg-gray-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      النوع
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newSignal.type}
                      onChange={handleSignalChange}
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      required
                    >
                      <option value="شراء">شراء</option>
                      <option value="بيع">بيع</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="entryPrice" className="text-sm font-medium">
                      سعر الدخول
                    </label>
                    <Input
                      id="entryPrice"
                      name="entryPrice"
                      type="number"
                      step="0.0001"
                      value={newSignal.entryPrice}
                      onChange={handleSignalChange}
                      placeholder="1.2345"
                      required
                      className="bg-gray-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="takeProfit" className="text-sm font-medium">
                      الهدف
                    </label>
                    <Input
                      id="takeProfit"
                      name="takeProfit"
                      type="number"
                      step="0.0001"
                      value={newSignal.takeProfit}
                      onChange={handleSignalChange}
                      placeholder="1.2400"
                      required
                      className="bg-gray-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stopLoss" className="text-sm font-medium">
                      وقف الخسارة
                    </label>
                    <Input
                      id="stopLoss"
                      name="stopLoss"
                      type="number"
                      step="0.0001"
                      value={newSignal.stopLoss}
                      onChange={handleSignalChange}
                      placeholder="1.2300"
                      required
                      className="bg-gray-800 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    الوصف
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newSignal.description}
                    onChange={handleSignalChange}
                    placeholder="أضف وصفًا..."
                    rows={3}
                    className="bg-gray-800 text-white"
                  />
                </div>
                <Button type="submit" className="w-full">
                  إرسال الإشارة
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>المتابعون</CardTitle>
              <CardDescription>إدارة وتحليل قاعدة المتابعين الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">إجمالي المتابعين</span>
                  <span className="text-2xl font-bold">
                    {providerData.followers}
                  </span>
                </div>
                <Progress value={75} className="w-full bg-gray-800" />
                <p className="text-sm text-muted-foreground">
                  75% من المتابعين نشطون في آخر 30 يومًا
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">الإيرادات</span>
                    <span className="text-2xl font-bold">
                      ${providerData.revenue}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">إحصائيات أخرى</span>
                    <span className="text-2xl font-bold">---</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>المنشورات</CardTitle>
              <CardDescription>عرض تفاعلات المتابعين على منشوراتك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {/* <p className="font-medium">{message.sender}</p> */}
                        <p className="text-sm text-muted-foreground">
                          {message.timestamp}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        عرض التفاعلات
                      </Button>
                    </div>
                    <p className="mt-2">{message.content}</p>
                  </div>
                ))}
                <div className="flex space-x-2 space-x-reverse">
                  <Input
                    placeholder="اكتب منشورًا جديدًا..."
                    className="bg-gray-800 text-white"
                  />
                  <Button>إرسال</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الحساب</CardTitle>
              <CardDescription>
                إدارة إعدادات حسابك وتفضيلاتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    الاسم
                  </label>
                  <Input
                    id="name"
                    defaultValue={providerData.name}
                    className="bg-gray-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="ahmed.mohamed@example.com"
                    className="bg-gray-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    نبذة تعريفية
                  </label>
                  <Textarea
                    id="bio"
                    placeholder="اكتب نبذة قصيرة عن نفسك وخبرتك في التداول..."
                    className="bg-gray-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    إعدادات الإشعارات
                  </label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="emailNotifications">
                      تلقي إشعارات عبر البريد الإلكتروني
                    </label>
                  </div>
                </div>
                <Button type="submit">حفظ التغييرات</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
}
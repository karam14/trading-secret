import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, BarChart2, ListIcon, TrendingUpIcon, UserIcon } from "lucide-react"

// Mock data for the provider
const providerData = {
  id: 1,
  name: "أحمد محمد",
  avatar: "/placeholder.svg?height=128&width=128",
  winRatio: 0.75,
  score: 92,
  totalTrades: 500,
  successfulTrades: 375,
  unsuccessfulTrades: 125,
  averageProfit: 2.8,
  averageLoss: 1.5,
  profitFactor: 2.8 / 1.5,
}

// Mock data for recent trades
const recentTrades = [
  { id: 1, asset: "EUR/USD", type: "شراء", result: "ربح", profit: 1.2, date: "2023-09-20" },
  { id: 2, asset: "AAPL", type: "بيع", result: "خسارة", profit: -0.8, date: "2023-09-19" },
  { id: 3, asset: "GOLD", type: "شراء", result: "ربح", profit: 2.1, date: "2023-09-18" },
  { id: 4, asset: "BTC/USD", type: "بيع", result: "ربح", profit: 3.5, date: "2023-09-17" },
  { id: 5, asset: "TSLA", type: "شراء", result: "خسارة", profit: -1.2, date: "2023-09-16" },
]

export default function ProviderProfile() {
  return (
    <div className="p-6 space-y-8 text-right">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Avatar className="w-20 h-20">
              <AvatarImage src={providerData.avatar} alt={providerData.name} />
              <AvatarFallback>{providerData.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{providerData.name}</CardTitle>
              <CardDescription>مزود إشارات التداول</CardDescription>
            </div>
          </div>
          <Button>متابعة</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">نسبة الفوز</p>
              <div className="flex items-center">
                <Progress value={providerData.winRatio * 100} className="ml-2" />
                <span className="font-bold">{(providerData.winRatio * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">النقاط</p>
              <p className="text-2xl font-bold">{providerData.score}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">
            <BarChart2 className="w-4 h-4 ml-2" />
            الإحصائيات
          </TabsTrigger>
          <TabsTrigger value="trades">
            <ListIcon className="w-4 h-4 ml-2" />
            الصفقات الأخيرة
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUpIcon className="w-4 h-4 ml-2" />
            الأداء
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>الإحصائيات العامة</CardTitle>
              <CardDescription>نظرة عامة على أداء المزود</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">إجمالي الصفقات</p>
                  <p className="text-2xl font-bold">{providerData.totalTrades}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">الصفقات الناجحة</p>
                  <p className="text-2xl font-bold text-green-600">{providerData.successfulTrades}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">الصفقات الخاسرة</p>
                  <p className="text-2xl font-bold text-red-600">{providerData.unsuccessfulTrades}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">معامل الربح</p>
                  <p className="text-2xl font-bold">{providerData.profitFactor.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>الصفقات الأخيرة</CardTitle>
              <CardDescription>آخر 5 صفقات للمزود</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الأصل</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">النتيجة</TableHead>
                    <TableHead className="text-right">الربح/الخسارة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.asset}</TableCell>
                      <TableCell>{trade.type}</TableCell>
                      <TableCell>
                        <Badge variant={trade.result === "ربح" ? "success" : "destructive"}>
                          {trade.result}
                        </Badge>
                      </TableCell>
                      <TableCell className={trade.profit > 0 ? "text-green-600" : "text-red-600"}>
                        {trade.profit > 0 ? "+" : ""}
                        {trade.profit.toFixed(2)}%
                      </TableCell>
                      <TableCell>{trade.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الأداء</CardTitle>
              <CardDescription>مؤشرات الأداء الرئيسية للمزود</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">متوسط الربح</span>
                    <span className="text-sm font-bold text-green-600">+{providerData.averageProfit.toFixed(2)}%</span>
                  </div>
                  <Progress value={providerData.averageProfit * 10} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">متوسط الخسارة</span>
                    <span className="text-sm font-bold text-red-600">-{providerData.averageLoss.toFixed(2)}%</span>
                  </div>
                  <Progress value={providerData.averageLoss * 10} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">الاتجاه العام</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <ArrowUpIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold">صاعد</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">التصنيف الكلي</span>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {[1, 2, 3, 4].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 fill-current text-yellow-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg
                      className="w-4 h-4 fill-current text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
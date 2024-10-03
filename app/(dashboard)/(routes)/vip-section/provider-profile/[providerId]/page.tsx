import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { fetchProviderData } from "@/actions/fetch-vip-section-data";

// Function to calculate profit or loss for each trade
function calculateProfitOrLoss(entryPrice: number, closingPrice: number | null, type: string): number {
  if (!closingPrice) return 0; // No profit or loss if trade is not closed
  return type === "buy"
    ? ((closingPrice - entryPrice) / entryPrice) * 100
    : ((entryPrice - closingPrice) / entryPrice) * 100;
}

const ProviderProfile = async ({ params }: { params: { providerId: string } }) => {
  const providerData = await fetchProviderData(params.providerId);

  if (!providerData) {
    return <div>Provider not found</div>;
  }

  const { provider, recentSignals } = providerData;

  // Calculate performance stats
  const totalTrades = recentSignals.length;
  const completedTrades = recentSignals.filter(signal => signal.status === "completed");
  const successfulTrades = completedTrades.filter(signal =>
    (signal.type === "buy" && signal.closing_price && signal.tp1 !== null && signal.closing_price >= signal.tp1) ||
    (signal.type === "sell" && signal.closing_price && signal.tp1 !== null && signal.closing_price <= signal.tp1)
  );
  const unsuccessfulTrades = completedTrades.filter(signal =>
    (signal.type === "buy" && signal.closing_price && signal.tp1 !== null && signal.closing_price < signal.tp1) ||
    (signal.type === "sell" && signal.closing_price && signal.tp1 !== null && signal.closing_price > signal.tp1)
  );

  const winRatio = totalTrades > 0 ? (successfulTrades.length / totalTrades) * 100 : 0;
  const averageProfit = successfulTrades.length > 0
    ? successfulTrades.reduce((sum, signal) => sum + calculateProfitOrLoss(signal.entry_price, signal.closing_price, signal.type), 0) / successfulTrades.length
    : 0;
  const averageLoss = unsuccessfulTrades.length > 0
    ? unsuccessfulTrades.reduce((sum, signal) => sum + calculateProfitOrLoss(signal.entry_price, signal.closing_price, signal.type), 0) / unsuccessfulTrades.length
    : 0;

  const profitFactor = averageProfit && averageLoss ? (averageProfit / Math.abs(averageLoss)) : 0;
  return (
    <div className="p-6 space-y-8 text-right">
      {/* Provider Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Avatar className="w-20 h-20">
              <AvatarImage src={provider.profile_view?.image_url ?? "/placeholder.svg"} alt={provider.profile_view?.name ?? undefined} />
              <AvatarFallback>{provider.profile_view?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{provider.profile_view?.name}</CardTitle>
              <CardDescription>مزود إشارات التداول</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">نسبة الفوز</p>
              <div className="flex items-center">
                <Progress value={winRatio} className="ml-2" />
                <span className="font-bold">{winRatio.toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">النقاط</p>
              <p className="text-2xl font-bold">{provider.score}</p>
            </div>
          </div>
        </CardContent>
      </Card>
  
      {/* Tabs for different sections */}
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
          <TabsTrigger value="trades">الصفقات الأخيرة</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
        </TabsList>
  
        {/* Statistics Tab */}
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
                  <p className="text-2xl font-bold">{totalTrades}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">الصفقات الناجحة</p>
                  <p className="text-2xl font-bold text-green-600">{successfulTrades.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">الصفقات الخاسرة</p>
                  <p className="text-2xl font-bold text-red-600">{unsuccessfulTrades.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">معامل الربح</p>
                  <p className="text-2xl font-bold">{profitFactor.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  
        {/* Recent Trades Tab */}
        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>الصفقات الأخيرة</CardTitle>
              <CardDescription>آخر 5 إشارات للمزود</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الأصل</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">سعر الدخول</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSignals.map((signal) => (
                    <TableRow key={signal.id}>
                      <TableCell>{signal.pair}</TableCell>
                      <TableCell>{signal.type === "buy" ? "شراء" : "بيع"}</TableCell>
                      <TableCell>
                        <Badge variant={signal.status === "completed" ? "success" : "default"}>
                        {signal.status === "completed" ? "مكتملة" : "جديدة"}
                      </Badge>
                    </TableCell>
                    <TableCell>{signal.entry_price.toFixed(2)}</TableCell>
                    <TableCell>{signal.timestamp ? new Date(signal.timestamp).toLocaleDateString() : "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Performance Tab */}
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
                  <span className="text-sm font-bold text-green-600">+{averageProfit.toFixed(2)}%</span>
                </div>
                <Progress value={averageProfit * 10} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">متوسط الخسارة</span>
                  <span className="text-sm font-bold text-red-600">-{averageLoss.toFixed(2)}%</span>
                </div>
                <Progress value={averageLoss * 10} className="h-2" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">الاتجاه العام</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {averageProfit > averageLoss ? (
                    <>
                      <ArrowUpIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold">صاعد</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold">هابط</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

};
export default ProviderProfile;
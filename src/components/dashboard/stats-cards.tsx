import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wallet, TrendingUp, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  totalOrders: number;
  totalRevenue: number;
  avgCheck: number;
  uniqueCities: number;
}

export function StatsCards({
  totalOrders,
  totalRevenue,
  avgCheck,
  uniqueCities,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-chart-1/50 transition-all duration-500 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Всего заказов</CardTitle>
          <div className="p-2 bg-chart-1/10 rounded-lg">
            <Package className="h-5 w-5 text-chart-1 drop-shadow-[0_0_8px_var(--color-chart-1)]" strokeWidth={1.5} />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold tracking-tight text-white">{totalOrders.toLocaleString("ru-RU")}</div>
          <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +14.2% за неделю
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-chart-2/50 transition-all duration-500 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Общая выручка</CardTitle>
          <div className="p-2 bg-chart-2/10 rounded-lg">
            <Wallet className="h-5 w-5 text-chart-2 drop-shadow-[0_0_8px_var(--color-chart-2)]" strokeWidth={1.5} />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold tracking-tight text-white">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center">
             <TrendingUp className="h-3 w-3 mr-1" /> +8.1% за неделю
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-chart-3/50 transition-all duration-500 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Средний чек</CardTitle>
          <div className="p-2 bg-chart-3/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-chart-3 drop-shadow-[0_0_8px_var(--color-chart-3)]" strokeWidth={1.5} />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold tracking-tight text-white">{formatCurrency(avgCheck)}</div>
          <p className="text-xs text-rose-400 mt-2 font-medium flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" /> -2.4% за неделю
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-chart-4/50 transition-all duration-500 shadow-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-4/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Города</CardTitle>
          <div className="p-2 bg-chart-4/10 rounded-lg">
            <MapPin className="h-5 w-5 text-chart-4 drop-shadow-[0_0_8px_var(--color-chart-4)]" strokeWidth={1.5} />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold tracking-tight text-white">{uniqueCities}</div>
          <p className="text-xs text-zinc-400 mt-2 font-medium">Новых городов за месяц: 1</p>
        </CardContent>
      </Card>
    </div>
  );
}

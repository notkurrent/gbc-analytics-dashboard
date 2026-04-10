"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Выручка (₸)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="flex flex-col h-full bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-500 shadow-xl group">
      <CardHeader>
        <CardTitle className="text-white drop-shadow-sm">Динамика выручки</CardTitle>
        <CardDescription className="text-zinc-400">Общая сумма заказов по дням</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(5, 10)}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  className="bg-background/90 backdrop-blur-md border-white/10"
                  formatter={(value) => `${Number(value).toLocaleString("ru-RU")} ₸`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-chart-2)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillRevenue)"
              animationDuration={1500}
              style={{ filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.5))" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

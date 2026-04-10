"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "Заказы по дням";

const chartConfig = {
  orders: {
    label: "Заказы",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface OrdersChartProps {
  data: { date: string; orders: number }[];
}

export function OrdersChart({ data }: OrdersChartProps) {
  return (
    <Card className="flex flex-col h-full bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-500 shadow-xl group">
      <CardHeader>
        <CardTitle className="text-white drop-shadow-sm">Динамика заказов</CardTitle>
        <CardDescription className="text-zinc-400">Количество заказов по дням</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(5, 10)} // Show MM-DD roughly
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--color-chart-1)", opacity: 0.1 }}
              content={<ChartTooltipContent hideLabel className="bg-background/90 backdrop-blur-md border-white/10" />}
            />
            <Bar dataKey="orders" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

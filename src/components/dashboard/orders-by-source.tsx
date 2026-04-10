"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
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
import * as React from "react";

interface OrdersBySourceProps {
  data: { source: string; orders: number; fill: string }[];
}

export function OrdersBySource({ data }: OrdersBySourceProps) {
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      orders: {
        label: "Заказы",
      },
    };
    data.forEach((item) => {
      config[item.source] = {
        label: item.source,
        color: item.fill,
      };
    });
    return config;
  }, [data]);

  return (
    <Card className="flex flex-col h-full bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-500 shadow-xl group">
      <CardHeader>
        <CardTitle className="text-white drop-shadow-sm">Источники трафика</CardTitle>
        <CardDescription className="text-zinc-400">UTM метки</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <YAxis
              dataKey="source"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={80}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={<ChartTooltipContent hideLabel className="bg-background/90 backdrop-blur-md border-white/10" />}
            />
            <Bar
              dataKey="orders"
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

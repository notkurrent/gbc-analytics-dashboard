"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface OrdersByCityProps {
  data: { city: string; orders: number; fill: string }[];
}

export function OrdersByCity({ data }: OrdersByCityProps) {
  // Dynamically build config for categories based on passed data
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      orders: {
        label: "Заказов",
      },
    };
    data.forEach((item) => {
      config[item.city] = {
        label: item.city,
        color: item.fill,
      };
    });
    return config;
  }, [data]);

  return (
    <Card className="flex flex-col h-full bg-white/5 md:backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors duration-500 transform-gpu shadow-xl group">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-white drop-shadow-sm">Заказы по городам</CardTitle>
        <CardDescription className="text-zinc-400">Распределение заказов</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel className="bg-background/90 backdrop-blur-md border-white/10" />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Pie
              data={data}
              dataKey="orders"
              nameKey="city"
              innerRadius={60}
              strokeWidth={2}
              stroke="transparent"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

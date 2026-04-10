"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order } from "@/types";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedOrders = showAll ? orders : orders.slice(0, 10);

  // Map RetailCRM status to Badge colors conceptually
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "cancel-other":
      case "canceled":
      case "return":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "delivering":
      case "send-to-delivery":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      new: "Новый",
      completed: "Выполнен",
      "cancel-other": "Отмена",
      canceled: "Отмена",
      return: "Возврат",
      delivering: "В доставке",
      "send-to-delivery": "Передан курьеру",
    };
    return map[status] || status;
  };

  // Helper to extract initials
  const getInitials = (first: string, last?: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "Г";
  };

  return (
    <Card className="bg-white/5 md:backdrop-blur-xl border-white/10 shadow-xl overflow-hidden group transform-gpu">
      <CardHeader>
        <CardTitle className="text-white drop-shadow-sm">Последние заказы {showAll && `(${orders.length})`}</CardTitle>
        <CardDescription className="text-zinc-400">Сводка самых свежих заказов</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto px-6 pt-6 pb-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5 transition-colors">
                <TableHead className="text-zinc-400 font-medium pb-4">Клиент</TableHead>
                <TableHead className="text-zinc-400 font-medium pb-4">Дата</TableHead>
                <TableHead className="text-zinc-400 font-medium pb-4">Город</TableHead>
                <TableHead className="text-zinc-400 font-medium pb-4">Источник (UTM)</TableHead>
                <TableHead className="text-zinc-400 font-medium pb-4">Статус</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium pb-4">Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.map((order, i) => (
                <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors group/row">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1 bg-chart-${(i % 5) + 1}/10 text-chart-${(i % 5) + 1} ring-chart-${(i % 5) + 1}/20`}
                      >
                        {getInitials(order.first_name, order.last_name)}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-200">
                          {order.first_name} {order.last_name || ""}
                        </div>
                        <div className="text-xs text-zinc-500 font-normal mt-0.5">ID: #{order.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-500 whitespace-nowrap">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-zinc-300">{order.city || "Не указан"}</TableCell>
                  <TableCell>
                    {order.utm_source ? (
                      <span className="font-mono text-xs text-chart-1 font-medium bg-chart-1/10 border border-chart-1/20 px-2.5 py-1 rounded-md">
                        {order.utm_source}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-medium tracking-wide border-opacity-50 ${getStatusColor(order.status)} drop-shadow-sm`}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-white tracking-wide">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {orders.length > 10 && (
        <CardFooter className="p-0 border-t border-white/5 bg-white/[0.02]">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="w-full h-full text-sm font-medium text-chart-1 hover:text-chart-1/80 transition-colors flex items-center justify-center py-4 gap-2"
          >
            {showAll ? "Свернуть список" : `Показать все заказы (${orders.length})`}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </CardFooter>
      )}
    </Card>
  );
}

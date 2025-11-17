"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
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
import { Badge } from "@/components/ui/badge";

const chartConfig = {
  tickets: {
    label: "Tickets",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type StatusDatum = {
  label: string;
  value: number;
};

interface StatusBarChartProps {
  data: StatusDatum[];
  title?: string;
  subtitle?: string;
  deltaLabel?: string;
}

export function StatusBarChart({
  data,
  title = "Status distribution",
  subtitle = "Tickets across lifecycle states",
  deltaLabel,
}: StatusBarChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-wrap items-center gap-2">
          {title}
          {deltaLabel ? (
            <Badge variant="outline" className="border-none bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>{deltaLabel}</span>
            </Badge>
          ) : null}
        </CardTitle>
        <CardDescription>
          {subtitle} · {total.toLocaleString()} total
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
            <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              shape={<CustomGradientBar dataKey="tickets" />}
              dataKey="value"
              fill="var(--color-tickets)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomGradientBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
  const { fill, x, y, width, height, dataKey } = props;

  if (x === undefined || y === undefined || width === undefined || height === undefined) {
    return null;
  }

  const xPos = typeof x === "number" ? x : Number(x)
  const yPos = typeof y === "number" ? y : Number(y)
  const rectWidth = typeof width === "number" ? width : Number(width)
  const rectHeight = typeof height === "number" ? height : Number(height)
  const gradientId = `gradient-bar-pattern-${dataKey ?? "bar"}-${Math.round(xPos)}-${Math.round(yPos)}`;

  return (
    <>
      <rect
        x={xPos}
        y={yPos}
        width={rectWidth}
        height={rectHeight}
        stroke="none"
        fill={`url(#${gradientId})`}
        rx={6}
        ry={6}
      />
      <rect x={xPos} y={yPos} width={rectWidth} height={2} stroke="none" fill={fill} rx={6} ry={6} />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};

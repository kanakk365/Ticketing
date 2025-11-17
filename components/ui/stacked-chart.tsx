"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type SalespersonData = {
  name: string
  open: number
  closedWon: number
  closedLost: number
  quoted: number
  duplicate: number
  unqualified: number
}

interface SalespersonStackedChartProps {
  data: SalespersonData[]
  title?: string
  subtitle?: string
}

const chartConfig = {
  open: {
    label: "Open",
    color: "hsl(210 29% 24%)",
  },
  closedWon: {
    label: "Closed Won",
    color: "hsl(168 32% 38%)",
  },
  closedLost: {
    label: "Closed Lost",
    color: "hsl(4 36% 40%)",
  },
  quoted: {
    label: "Quoted",
    color: "hsl(213 22% 44%)",
  },
  duplicate: {
    label: "Duplicate",
    color: "hsl(30 44% 48%)",
  },
  unqualified: {
    label: "Unqualified",
    color: "hsl(20 20% 52%)",
  },
} satisfies ChartConfig

export function SalespersonStackedChart({
  data,
  title = "Salesperson ticket breakdown",
  subtitle = "Stacked view of ticket statuses by rep",
}: SalespersonStackedChartProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeOpacity={0.4} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="open"
              stackId="a"
              fill="var(--color-open)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="closedWon"
              stackId="a"
              fill="var(--color-closedWon)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="closedLost"
              stackId="a"
              fill="var(--color-closedLost)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="quoted"
              stackId="a"
              fill="var(--color-quoted)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="duplicate"
              stackId="a"
              fill="var(--color-duplicate)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="unqualified"
              stackId="a"
              fill="var(--color-unqualified)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

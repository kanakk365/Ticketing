"use client"

import { useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ArrowUpRight, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { StatusBarChart } from "@/components/ui/barchart"
import { SalespersonStackedChart } from "@/components/ui/stacked-chart"

type RegionKey = "intrastate" | "interstate"

type SummaryStat = {
  label: string
  value: string
  caption: string
  accent: string
}

type SalespersonRow = {
  name: string
  open: number
  closedWon: number
  closedLost: number
  quoted: number
  duplicate: number
  unqualified: number
  successRate: number
}

type TicketDataset = {
  summary: SummaryStat[]
  salespeople: SalespersonRow[]
  statusMix: { status: string; tickets: number }[]
  weeklySuccess: { week: string; successRate: number; quota: number }[]
  topClosers: { rank: number; name: string; closed: number }[]
}

const ticketPerformance: Record<RegionKey, TicketDataset> = {
  intrastate: {
    summary: [
      {
        label: "Open",
        value: "13",
        caption: "Active conversations",
        accent: "from-[#334155] to-[#1e293b]",
      },
      {
        label: "Closed Won",
        value: "70",
        caption: "Converted in last cycle",
        accent: "from-[#47716f] to-[#2d4a49]",
      },
      {
        label: "Closed Lost",
        value: "23",
        caption: "Need follow-up feedback",
        accent: "from-[#8b6356] to-[#5c4139]",
      },
      {
        label: "Quoted",
        value: "171",
        caption: "Awaiting customer response",
        accent: "from-[#5a6c8f] to-[#3d4966]",
      },
      {
        label: "Duplicate",
        value: "21",
        caption: "Auto-triaged",
        accent: "from-[#8b7355] to-[#5c4d38]",
      },
      {
        label: "UnQualified",
        value: "25",
        caption: "Moved back to nurture",
        accent: "from-[#7d7c7a] to-[#565553]",
      },
      {
        label: "Converted Leads",
        value: "241",
        caption: "Total this quarter",
        accent: "from-[#3d5a80] to-[#2a3e5a]",
      },
      {
        label: "Success Rate",
        value: "40.94%",
        caption: "+2.8% vs last week",
        accent: "from-[#4a5568] to-[#2d3748]",
      },
    ],
    salespeople: [
      { name: "Anu", open: 1, closedWon: 0, closedLost: 0, quoted: 0, duplicate: 0, unqualified: 0, successRate: 0 },
      { name: "Rekha", open: 5, closedWon: 25, closedLost: 1, quoted: 57, duplicate: 7, unqualified: 1, successRate: 43.86 },
      { name: "Sandhiya", open: 3, closedWon: 25, closedLost: 20, quoted: 58, duplicate: 9, unqualified: 17, successRate: 43.1 },
      { name: "Sarvesh", open: 4, closedWon: 16, closedLost: 2, quoted: 43, duplicate: 1, unqualified: 7, successRate: 37.21 },
      { name: "Debasmita", open: 0, closedWon: 4, closedLost: 0, quoted: 13, duplicate: 4, unqualified: 0, successRate: 30.77 },
    ],
    statusMix: [
      { status: "Open", tickets: 13 },
      { status: "Closed Won", tickets: 70 },
      { status: "Closed Lost", tickets: 23 },
      { status: "Quoted", tickets: 171 },
      { status: "Duplicate", tickets: 21 },
      { status: "UnQualified", tickets: 25 },
    ],
    weeklySuccess: [
      { week: "W18", successRate: 34, quota: 60 },
      { week: "W19", successRate: 37, quota: 60 },
      { week: "W20", successRate: 38, quota: 60 },
      { week: "W21", successRate: 42, quota: 60 },
      { week: "W22", successRate: 41, quota: 60 },
      { week: "W23", successRate: 44, quota: 60 },
    ],
    topClosers: [
      { rank: 1, name: "Sandhiya", closed: 48 },
      { rank: 2, name: "Rekha", closed: 43 },
      { rank: 3, name: "Sarvesh", closed: 28 },
      { rank: 4, name: "Debasmita", closed: 22 },
      { rank: 5, name: "Anu", closed: 18 },
    ],
  },
  interstate: {
    summary: [
      {
        label: "Open",
        value: "19",
        caption: "Cross-state follow ups",
        accent: "from-[#334155] to-[#1e293b]",
      },
      {
        label: "Closed Won",
        value: "52",
        caption: "Closed in last sprint",
        accent: "from-[#47716f] to-[#2d4a49]",
      },
      {
        label: "Closed Lost",
        value: "18",
        caption: "Marked as churn",
        accent: "from-[#8b6356] to-[#5c4139]",
      },
      {
        label: "Quoted",
        value: "149",
        caption: "High-value quotes",
        accent: "from-[#5a6c8f] to-[#3d4966]",
      },
      {
        label: "Duplicate",
        value: "18",
        caption: "Consolidated records",
        accent: "from-[#8b7355] to-[#5c4d38]",
      },
      {
        label: "UnQualified",
        value: "21",
        caption: "Awaiting nurture",
        accent: "from-[#7d7c7a] to-[#565553]",
      },
      {
        label: "Converted Leads",
        value: "198",
        caption: "Quarter-to-date",
        accent: "from-[#3d5a80] to-[#2a3e5a]",
      },
      {
        label: "Success Rate",
        value: "36.10%",
        caption: "+1.1% vs last week",
        accent: "from-[#4a5568] to-[#2d3748]",
      },
    ],
    salespeople: [
      { name: "Anu", open: 2, closedWon: 3, closedLost: 1, quoted: 7, duplicate: 0, unqualified: 0, successRate: 30 },
      { name: "Rekha", open: 6, closedWon: 18, closedLost: 2, quoted: 44, duplicate: 5, unqualified: 3, successRate: 34.62 },
      { name: "Sandhiya", open: 4, closedWon: 21, closedLost: 9, quoted: 52, duplicate: 6, unqualified: 12, successRate: 39.62 },
      { name: "Sarvesh", open: 5, closedWon: 10, closedLost: 4, quoted: 31, duplicate: 2, unqualified: 5, successRate: 28.57 },
      { name: "Debasmita", open: 2, closedWon: 7, closedLost: 2, quoted: 15, duplicate: 3, unqualified: 1, successRate: 36.84 },
    ],
    statusMix: [
      { status: "Open", tickets: 19 },
      { status: "Closed Won", tickets: 52 },
      { status: "Closed Lost", tickets: 18 },
      { status: "Quoted", tickets: 149 },
      { status: "Duplicate", tickets: 18 },
      { status: "UnQualified", tickets: 21 },
    ],
    weeklySuccess: [
      { week: "W18", successRate: 28, quota: 55 },
      { week: "W19", successRate: 31, quota: 55 },
      { week: "W20", successRate: 34, quota: 55 },
      { week: "W21", successRate: 36, quota: 55 },
      { week: "W22", successRate: 35, quota: 55 },
      { week: "W23", successRate: 37, quota: 55 },
    ],
    topClosers: [
      { rank: 1, name: "Rekha", closed: 39 },
      { rank: 2, name: "Sandhiya", closed: 33 },
      { rank: 3, name: "Sarvesh", closed: 19 },
      { rank: 4, name: "Debasmita", closed: 16 },
      { rank: 5, name: "Anu", closed: 12 },
    ],
  },
}

export default function TicketPerformance() {
  const [activeRegion, setActiveRegion] = useState<RegionKey>("intrastate")
  const [selectedRep, setSelectedRep] = useState<string>("all")

  const dataset = ticketPerformance[activeRegion]

  const tableRows = useMemo(() => {
    if (selectedRep === "all") {
      return dataset.salespeople
    }
    return dataset.salespeople.filter((rep) => rep.name === selectedRep)
  }, [dataset.salespeople, selectedRep])

  const statusChartData = useMemo(() => {
    const open = dataset.salespeople.reduce((sum, rep) => sum + rep.open, 0)
    const closedWon = dataset.salespeople.reduce((sum, rep) => sum + rep.closedWon, 0)
    const closedLost = dataset.salespeople.reduce((sum, rep) => sum + rep.closedLost, 0)
    const quoted = dataset.salespeople.reduce((sum, rep) => sum + rep.quoted, 0)
    const duplicate = dataset.salespeople.reduce((sum, rep) => sum + rep.duplicate, 0)
    const unqualified = dataset.salespeople.reduce((sum, rep) => sum + rep.unqualified, 0)
    const convertedLeads = parseInt(dataset.summary.find((s) => s.label === "Converted Leads")?.value || "0")
    const successRate = parseFloat(dataset.summary.find((s) => s.label === "Success Rate")?.value || "0")

    return [
      { label: "Converted Leads", value: convertedLeads },
      { label: "Quoted", value: quoted },
      { label: "Closed Won", value: closedWon },
      { label: "Success Rate", value: successRate },
      { label: "Unqualified", value: unqualified },
      { label: "Closed Lost", value: closedLost },
      { label: "Duplicate", value: duplicate },
      { label: "Open", value: open },
    ]
  }, [dataset.salespeople, dataset.summary])

  const successDelta = dataset.summary.find((stat) => stat.label === "Success Rate")?.caption

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ticket Pipeline</p>
          <h1 className="text-2xl font-semibold text-foreground">Ticket performance dashboard</h1>
          <p className="text-muted-foreground text-sm">Monitor pipeline health, conversion velocity, and team focus across sales lanes.</p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          {( ["intrastate", "interstate"] as RegionKey[] ).map((region) => (
            <Button
              key={region}
              variant={activeRegion === region ? "default" : "outline"}
              className="flex-1 md:flex-none"
              onClick={() => {
                setActiveRegion(region)
                setSelectedRep("all")
              }}
            >
              {region === "intrastate" ? "Intrastate" : "Interstate"}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dataset.summary.map((stat) => (
          <Card
            key={stat.label}
            className={`border-none text-white shadow-lg shadow-zinc-900/5 bg-linear-to-br ${stat.accent}`}
          >
            <CardHeader className="space-y-2">
              <CardDescription className="uppercase tracking-wide text-white/70 text-xs">
                {stat.label}
              </CardDescription>
              <CardTitle className="text-3xl font-semibold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80">{stat.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <StatusBarChart data={statusChartData} deltaLabel={successDelta} />
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Top closers</CardTitle>
            <CardDescription>Measured by leads closed this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataset.topClosers.map((closer) => (
              <div
                key={closer.rank}
                className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <Badge className="bg-primary/10 text-primary border-transparent text-sm font-semibold">
                    #{closer.rank}
                  </Badge>
                  <div>
                    <p className="font-semibold">{closer.name}</p>
                    <p className="text-sm text-muted-foreground">{closer.closed} closed leads</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="h-full">
        <CardHeader className="flex flex- justify-between items-center gap-4 border-b pb-6">
          <div>
            <CardTitle className="text-xl">Salesperson performance</CardTitle>
            <CardDescription>Success rate is calculated from closed won vs total opportunities.</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              {selectedRep === "all" ? "All reps" : selectedRep}
            </div>
            <Select
              value={selectedRep}
              onValueChange={(value) => setSelectedRep(value)}
            >
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Filter by rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All salespeople</SelectItem>
                {dataset.salespeople.map((rep) => (
                  <SelectItem key={rep.name} value={rep.name}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Salesperson</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>Closed Won</TableHead>
                <TableHead>Closed Lost</TableHead>
                <TableHead>Quoted</TableHead>
                <TableHead>Duplicate</TableHead>
                <TableHead>UnQualified</TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.open}</TableCell>
                  <TableCell>{row.closedWon}</TableCell>
                  <TableCell>{row.closedLost}</TableCell>
                  <TableCell>{row.quoted}</TableCell>
                  <TableCell>{row.duplicate}</TableCell>
                  <TableCell>{row.unqualified}</TableCell>
                  <TableCell className="text-right font-mono">
                    {row.successRate.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SalespersonStackedChart data={dataset.salespeople} />
    </section>
  )
}

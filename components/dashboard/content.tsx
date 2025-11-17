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
  type ChartConfig,
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

const vibrantPalette = {
  aqua: "#4bcbeb",
  blush: "#fe9496",
  violet: "#9e58ff",
  orchid: "#a05aff",
  teal: "#1bcfb4",
  magenta: "#f72585",
  cyan: "#4bc8f0",
  royal: "#4d0a99",
  periwinkle: "#7da0fa",
  iris: "#7978e9",
  peach: "#f3797e",
  ice: "#98bdff",
} as const

const statusPalette: Record<string, string> = {
  "Converted Leads": vibrantPalette.orchid,
  Quoted: vibrantPalette.periwinkle,
  "Closed Won": vibrantPalette.teal,
  "Success Rate": vibrantPalette.iris,
  Unqualified: vibrantPalette.violet,
  UnQualified: vibrantPalette.violet,
  "Closed Lost": vibrantPalette.blush,
  Duplicate: vibrantPalette.magenta,
  Open: vibrantPalette.ice,
}

const ticketPerformance: Record<RegionKey, TicketDataset> = {
  intrastate: {
    summary: [
      {
        label: "Open",
        value: "13",
        caption: "Active conversations",
        accent: "from-[#4bcbeb] via-[#7da0fa] to-[#98bdff]",
      },
      {
        label: "Closed Won",
        value: "70",
        caption: "Converted in last cycle",
        accent: "from-[#1bcfb4] via-[#4bc8f0] to-[#7da0fa]",
      },
      {
        label: "Closed Lost",
        value: "23",
        caption: "Need follow-up feedback",
        accent: "from-[#fe9496] via-[#f3797e] to-[#f72585]",
      },
      {
        label: "Quoted",
        value: "171",
        caption: "Awaiting customer response",
        accent: "from-[#7da0fa] via-[#9e58ff] to-[#4d0a99]",
      },
      {
        label: "Duplicate",
        value: "21",
        caption: "Auto-triaged",
        accent: "from-[#f72585] via-[#fe9496] to-[#f3797e]",
      },
      {
        label: "UnQualified",
        value: "25",
        caption: "Moved back to nurture",
        accent: "from-[#9e58ff] via-[#a05aff] to-[#4d0a99]",
      },
      {
        label: "Converted Leads",
        value: "241",
        caption: "Total this quarter",
        accent: "from-[#a05aff] via-[#7da0fa] to-[#4bcbeb]",
      },
      {
        label: "Success Rate",
        value: "40.94%",
        caption: "+2.8% vs last week",
        accent: "from-[#7978e9] via-[#9e58ff] to-[#4d0a99]",
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
        accent: "from-[#4bcbeb] via-[#7da0fa] to-[#98bdff]",
      },
      {
        label: "Closed Won",
        value: "52",
        caption: "Closed in last sprint",
        accent: "from-[#1bcfb4] via-[#4bc8f0] to-[#7da0fa]",
      },
      {
        label: "Closed Lost",
        value: "18",
        caption: "Marked as churn",
        accent: "from-[#fe9496] via-[#f3797e] to-[#f72585]",
      },
      {
        label: "Quoted",
        value: "149",
        caption: "High-value quotes",
        accent: "from-[#7da0fa] via-[#9e58ff] to-[#4d0a99]",
      },
      {
        label: "Duplicate",
        value: "18",
        caption: "Consolidated records",
        accent: "from-[#f72585] via-[#fe9496] to-[#f3797e]",
      },
      {
        label: "UnQualified",
        value: "21",
        caption: "Awaiting nurture",
        accent: "from-[#9e58ff] via-[#a05aff] to-[#4d0a99]",
      },
      {
        label: "Converted Leads",
        value: "198",
        caption: "Quarter-to-date",
        accent: "from-[#a05aff] via-[#7da0fa] to-[#4bcbeb]",
      },
      {
        label: "Success Rate",
        value: "36.10%",
        caption: "+1.1% vs last week",
        accent: "from-[#7978e9] via-[#9e58ff] to-[#4d0a99]",
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

const velocityChartConfig = {
  successRate: {
    label: "Success rate",
    color: "#f72585",
  },
  quota: {
    label: "Quota",
    color: "#4bcbeb",
  },
} satisfies ChartConfig

export default function TicketPerformance() {
  const [activeRegion, setActiveRegion] = useState<RegionKey>("intrastate")
  const [selectedRep, setSelectedRep] = useState<string>("all")

  const dataset = ticketPerformance[activeRegion]
  const activeRegionLabel = activeRegion === "intrastate" ? "Intrastate" : "Interstate"

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
      { label: "Converted Leads", value: convertedLeads, color: statusPalette["Converted Leads"] },
      { label: "Quoted", value: quoted, color: statusPalette.Quoted },
      { label: "Closed Won", value: closedWon, color: statusPalette["Closed Won"] },
      { label: "Success Rate", value: successRate, color: statusPalette["Success Rate"] },
      { label: "Unqualified", value: unqualified, color: statusPalette.Unqualified },
      { label: "Closed Lost", value: closedLost, color: statusPalette["Closed Lost"] },
      { label: "Duplicate", value: duplicate, color: statusPalette.Duplicate },
      { label: "Open", value: open, color: statusPalette.Open },
    ]
  }, [dataset.salespeople, dataset.summary])

  const successDelta = dataset.summary.find((stat) => stat.label === "Success Rate")?.caption
  const weeklyInsights = useMemo(() => {
    if (!dataset.weeklySuccess.length) {
      return {
        latest: null as TicketDataset["weeklySuccess"][number] | null,
        previous: null as TicketDataset["weeklySuccess"][number] | null,
        best: null as TicketDataset["weeklySuccess"][number] | null,
        average: 0,
        quotaHits: 0,
      }
    }

    const latest = dataset.weeklySuccess[dataset.weeklySuccess.length - 1] ?? null
    const previous = dataset.weeklySuccess[dataset.weeklySuccess.length - 2] ?? null
    const best = dataset.weeklySuccess.reduce((peak, entry) => {
      if (!peak) return entry
      return entry.successRate > peak.successRate ? entry : peak
    }, dataset.weeklySuccess[0])
    const totalSuccess = dataset.weeklySuccess.reduce((sum, entry) => sum + entry.successRate, 0)
    const quotaHits = dataset.weeklySuccess.filter((entry) => entry.successRate >= entry.quota).length

    return {
      latest,
      previous,
      best,
      average: totalSuccess / dataset.weeklySuccess.length,
      quotaHits,
    }
  }, [dataset.weeklySuccess])

  const successMomentum = weeklyInsights.latest && weeklyInsights.previous
    ? weeklyInsights.latest.successRate - weeklyInsights.previous.successRate
    : 0
  const quotaGap = weeklyInsights.latest
    ? weeklyInsights.latest.successRate - weeklyInsights.latest.quota
    : 0
  const quotaHitPercentage = dataset.weeklySuccess.length
    ? (weeklyInsights.quotaHits / dataset.weeklySuccess.length) * 100
    : 0

  const pipelineSignals = useMemo(() => {
    if (!dataset.salespeople.length) {
      return [] as Array<{ label: string; value: string; detail: string; color: string }>
    }

    const sortedBySuccess = [...dataset.salespeople].sort((a, b) => b.successRate - a.successRate)
    const topConverter = sortedBySuccess[0]

    const totals = dataset.salespeople.reduce(
      (acc, rep) => {
        acc.open += rep.open
        acc.quoted += rep.quoted
        acc.duplicate += rep.duplicate
        acc.closedWon += rep.closedWon
        acc.closedLost += rep.closedLost
        return acc
      },
      { open: 0, quoted: 0, duplicate: 0, closedWon: 0, closedLost: 0 },
    )

    const convertedLeads = parseInt(dataset.summary.find((stat) => stat.label === "Converted Leads")?.value || "0")
    const conversionShare = totals.quoted ? (convertedLeads / totals.quoted) * 100 : 0
    const duplicateRate = totals.quoted ? (totals.duplicate / totals.quoted) * 100 : 0
    const winLossMix = totals.closedWon + totals.closedLost
      ? (totals.closedWon / (totals.closedWon + totals.closedLost)) * 100
      : 0

    const heaviestPipeline = dataset.salespeople.reduce((prev, rep) => {
      if (!prev) return rep
      const prevLoad = prev.open + prev.quoted
      const repLoad = rep.open + rep.quoted
      return repLoad > prevLoad ? rep : prev
    }, dataset.salespeople[0])

    return [
      {
        label: "Top converter",
        value: topConverter ? topConverter.name : "—",
        detail: topConverter ? `${topConverter.successRate.toFixed(1)}% win rate` : "Awaiting activity",
        color: vibrantPalette.magenta,
      },
      {
        label: "Lead conversions",
        value: convertedLeads.toLocaleString(),
        detail: `${conversionShare.toFixed(1)}% of current quotes`,
        color: vibrantPalette.orchid,
      },
      {
        label: "Duplicate drag",
        value: `${duplicateRate.toFixed(1)}%`,
        detail: `${totals.duplicate.toLocaleString()} flagged records`,
        color: vibrantPalette.blush,
      },
      {
        label: "Win / loss mix",
        value: `${winLossMix.toFixed(1)}%`,
        detail: `${totals.closedWon.toLocaleString()} won vs ${totals.closedLost.toLocaleString()} lost`,
        color: vibrantPalette.aqua,
      },
      {
        label: "Heaviest pipeline",
        value: heaviestPipeline ? heaviestPipeline.name : "—",
        detail: heaviestPipeline ? `${heaviestPipeline.open} open · ${heaviestPipeline.quoted} quoted` : "No active load",
        color: vibrantPalette.violet,
      },
    ]
  }, [dataset.salespeople, dataset.summary])

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ticket Pipeline</p>
          <h1 className="text-2xl font-semibold text-foreground">Ticket performance dashboard</h1>
          <p className="text-muted-foreground text-sm">Track how tickets move through your sales process.</p>
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
            <CardDescription>Most deals closed this week.</CardDescription>
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
                <ArrowUpRight className="h-4 w-4"  />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="h-full">
        <CardHeader className="flex flex- justify-between items-center gap-4 border-b pb-6">
          <div>
            <CardTitle className="text-xl">Salesperson performance</CardTitle>
            <CardDescription>Success rate = deals won ÷ total deals.</CardDescription>
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

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="h-full">
          <SalespersonStackedChart data={dataset.salespeople} />
        </div>
        <div className="grid gap-6">

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Response time</CardTitle>
              <CardDescription>Average time to first response.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataset.salespeople.map((person, index) => {
                const colors = [vibrantPalette.magenta, vibrantPalette.orchid, vibrantPalette.blush, vibrantPalette.aqua, vibrantPalette.violet]
                const color = colors[index % colors.length]
                return (
                  <div
                    key={person.name}
                    className="rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: `${color}33`,
                      backgroundColor: `${color}12`,
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {person.name}
                    </p>
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <span className="text-2xl font-semibold" style={{ color }}>
                        {Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}m
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {person.open + person.quoted} active tickets
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

"use client"

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState, type ComponentType } from "react"

import { cn } from "@/lib/utils"

interface NavLinkItem {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const navSections: { title: string; items: NavLinkItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "#", icon: Home },
      { label: "Analytics", href: "#", icon: BarChart2 },
      { label: "Organization", href: "#", icon: Building2 },
      { label: "Projects", href: "#", icon: Folder },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Transactions", href: "#", icon: Wallet },
      { label: "Invoices", href: "#", icon: Receipt },
      { label: "Payments", href: "#", icon: CreditCard },
    ],
  },
  {
    title: "Team",
    items: [
      { label: "Members", href: "#", icon: Users2 },
      { label: "Permissions", href: "#", icon: Shield },
      { label: "Chat", href: "#", icon: MessagesSquare },
      { label: "Meetings", href: "#", icon: Video },
    ],
  },
]

const footerItems: NavLinkItem[] = [
  { label: "Settings", href: "#", icon: Settings },
  { label: "Help", href: "#", icon: HelpCircle },
]

interface NavItemProps extends NavLinkItem {
  collapsed: boolean
  onNavigate: () => void
}

function NavItem({ href, icon: Icon, label, collapsed, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={label}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ease-out text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]",
        collapsed && "lg:justify-center lg:gap-0"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0 transition-all duration-200", collapsed && "lg:mr-0")} />
      <span className={cn("text-sm font-medium transition-opacity duration-200", collapsed && "lg:hidden lg:opacity-0")}>{label}</span>
    </Link>
  )
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  const CollapseToggleIcon = isCollapsed ? ChevronRight : ChevronLeft

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-70 p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-70 w-64 bg-white dark:bg-[#0F0F12] transform border-r border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-out lg:static",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-[#1F1F23]">
            <div className="flex items-center gap-3">
              <div className={cn("flex flex-col transition-all duration-200 ease-out", isCollapsed && "lg:hidden lg:opacity-0")}
              >
                <span className="text-base font-semibold text-gray-900 dark:text-white">Ticket Pulse</span>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">ops</span>
              </div>
            </div>
            <button
              type="button"
              className="hidden rounded-lg border border-transparent p-2 text-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#1F1F23] lg:inline-flex"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <CollapseToggleIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-6">
              {navSections.map((section) => (
                <div key={section.title}>
                  <div
                    className={cn(
                      "px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-all duration-200 ease-out",
                      isCollapsed && "lg:hidden lg:opacity-0"
                    )}
                  >
                    {section.title}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem key={item.label} {...item} collapsed={isCollapsed} onNavigate={handleNavigation} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-4 dark:border-[#1F1F23]">
            <div className="space-y-1">
              {footerItems.map((item) => (
                <NavItem key={item.label} {...item} collapsed={isCollapsed} onNavigate={handleNavigation} />
              ))}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-65 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

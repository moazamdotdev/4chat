"use client"

import * as React from "react"
import Link from "next/link"
import {
  Plus,
  ExternalLink,
  LogOut,
  Settings,
  Keyboard,
  MoreHorizontal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SITE } from "@/lib/site"
import { Logo } from "@/components/site/logo"

interface AppSidebarProps {
  user?: {
    name?: string | null
    image?: string | null
  } | null
  isProUser?: boolean
}

export function AppSidebar({ user, isProUser = false }: AppSidebarProps) {
  const { state, isMobile, setOpenMobile } = useSidebar()

  const closeMobileSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile(false)
  }, [isMobile, setOpenMobile])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0!">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative flex h-12 w-full items-center overflow-visible px-2">
              <Button
                asChild
                variant="ghost"
                className="h-auto w-fit justify-start px-2 py-1 group-data-[collapsible=icon]:p-0 hover:bg-transparent!"
              >
                <Link
                  href="/"
                  onClick={closeMobileSidebar}
                  aria-label="Home"
                  className="inline-flex w-fit items-center gap-1 group-data-[collapsible=icon]:mx-auto"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center transition-opacity duration-200 group-data-[collapsible=icon]:group-hover:opacity-0">
                    <Logo className="size-6" />
                  </div>
                  <div className="flex flex-row items-center gap-2 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-display text-xl font-semibold tracking-tight">
                      {SITE.name}
                    </span>
                  </div>
                </Link>
              </Button>

              <div className="absolute top-2 right-2 group-data-[collapsible=icon]:hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="size-8" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    hidden={state !== "expanded" || isMobile}
                  >
                    Close Sidebar{" "}
                    <span className="pl-0.5 text-xs text-secondary">⌘B</span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-data-[collapsible=icon]:group-hover:pointer-events-auto group-data-[collapsible=icon]:group-hover:opacity-100">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="size-8 opacity-0 transition-opacity duration-200 group-data-[collapsible=icon]:group-hover:opacity-100" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    hidden={state !== "collapsed" || isMobile}
                  >
                    Open Sidebar{" "}
                    <span className="pl-1 text-xs text-secondary">⌘B</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarGroup className="shrink-0 gap-0 p-2 pb-0">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="New Chat"
              className="text-sidebar-foreground transition-all duration-200 hover:!bg-transparent hover:!text-foreground active:!bg-transparent data-active:!bg-transparent"
            >
              <Link
                href="/"
                onClick={closeMobileSidebar}
                className="flex items-center gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
              >
                <Plus size={18} />
                <span className="group-data-[collapsible=icon]:hidden">
                  New Chat
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="GitHub"
              className="text-sidebar-foreground hover:!bg-transparent hover:!text-foreground active:!bg-transparent data-active:!bg-transparent"
            >
              <a
                href={SITE.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
              >
                <ExternalLink size={18} />
                <span className="group-data-[collapsible=icon]:hidden">
                  GitHub
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarContent className="p-2 pt-0" />

      <SidebarFooter className="gap-0 border-t border-border p-0 group-data-[collapsible=icon]:border-none">
        {user ? (
          <SidebarMenu className="gap-0">
            <SidebarMenuItem>
              <div className="group-data-[collapsible=icon]:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left ring-0 outline-hidden transition-colors hover:bg-sidebar-accent focus-visible:ring-0">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Avatar size="default">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                            {user.name
                              ? user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.25 leading-none">
                          <span className="w-full truncate text-left text-sm font-semibold text-sidebar-foreground">
                            {user.name || "User"}
                          </span>
                          <span className="w-full truncate text-left text-xs text-sidebar-foreground/70">
                            {isProUser ? "4chat Pro" : "4chat Free"}
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="center"
                    className="w-62"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="py-2">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm leading-none font-semibold">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isProUser ? "4chat Pro" : "4chat Free"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" onClick={closeMobileSidebar}>
                          <Settings size={16} />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Keyboard size={16} />
                        <span>Shortcuts</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="hidden py-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 overflow-visible p-0"
                    >
                      <Avatar size="sm">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                          {user.name
                            ? user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    className="w-60"
                  >
                    <DropdownMenuLabel className="py-2">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm leading-none font-semibold">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isProUser ? "4chat Pro" : "4chat Free"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" onClick={closeMobileSidebar}>
                          <Settings size={16} />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Keyboard size={16} />
                        <span>Shortcuts</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu className="gap-0 p-2">
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
              <Link
                href="/login"
                onClick={closeMobileSidebar}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-sidebar-accent"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-muted">
                  <LogOut size={16} className="text-muted-foreground" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">Sign In</span>
                </div>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/login"
                    onClick={closeMobileSidebar}
                    className="mx-auto flex size-8 items-center justify-center rounded-md bg-muted transition-colors hover:bg-sidebar-accent"
                  >
                    <LogOut size={16} className="text-muted-foreground" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Sign In
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

AppSidebar.displayName = "AppSidebar"

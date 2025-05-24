"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@/components/ui/collapsible";
import { useTheme } from "next-themes";
import { Sun, Moon, ChevronDown, Menu, ExternalLink } from "lucide-react";

interface SidebarProps {
  widgets: { href: string; name: string }[];
}

export function AppSidebar({ widgets }: SidebarProps) {
  const { setTheme } = useTheme();

  return (
    <UISidebar className="border-r border-red-500/20 z-50 mobile-sidebar">
      <SidebarHeader className="py-6 px-6">
        <Link
          className="text-4xl text-center block transition-transform hover:scale-105 duration-300"
          href="/"
        >
          &lt;
          <span className="font-black font-playwrite text-primary-800 text-glow">
            Rhed
          </span>{" "}
          /&gt;
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 space-y-6">
        <SidebarGroup>
          <SidebarMenu className="space-y-4">
            {/* Widgets Dropdown */}
            <Collapsible className="group/collapsible red-glass rounded-lg overflow-hidden shadow-red">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="text-lg w-full hover:bg-red-500/10 transition-all duration-300 py-3 px-4 flex items-center justify-between">
                    <span className="font-medium flex items-center">
                      Widgets
                    </span>
                    <ChevronDown className="transition-transform duration-300 h-4 w-4 group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="sidebar-dropdown-animation">
                  <SidebarMenuSub className="space-y-2">
                    {widgets.map((widget) => (
                      <SidebarMenuSubItem
                        key={widget.href}
                        className="rounded-md hover:bg-red-500/10"
                      >
                        <Link
                          href={widget.href}
                          className="block p-1 text-base hover:text-red-300 transition-colors"
                        >
                          {widget.name}
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* GitHub Link */}
            <SidebarMenuItem className="red-glass rounded-lg overflow-hidden shadow-red">
              <SidebarMenuButton
                className="text-lg w-full py-3 px-4 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-between"
                asChild
              >
                <Link
                  href="https://github.com/rhamzthev/rhed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium"
                >
                  GitHub <ExternalLink className="h-4 w-4" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Theme Toggle */}
            <Collapsible className="group/collapsible red-glass rounded-lg overflow-hidden shadow-red">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="text-lg w-full hover:bg-red-500/10 transition-all duration-300 py-3 px-4 flex items-center justify-between">
                    <span className="font-medium flex items-center">Theme</span>
                    <div className="flex items-center justify-center relative">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="sidebar-dropdown-animation">
                  <SidebarMenuSub className="space-y-2">
                    <SidebarMenuSubItem
                      onClick={() => setTheme("light")}
                      className="rounded-md hover:bg-red-500/10"
                    >
                      <span className="block p-1 text-base hover:text-red-300 transition-colors cursor-pointer">
                        Light
                      </span>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem
                      onClick={() => setTheme("dark")}
                      className="rounded-md hover:bg-red-500/10"
                    >
                      <span className="block p-1 text-base hover:text-red-300 transition-colors cursor-pointer">
                        Dark
                      </span>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem
                      onClick={() => setTheme("system")}
                      className="rounded-md hover:bg-red-500/10"
                    >
                      <span className="block p-1 text-base hover:text-red-300 transition-colors cursor-pointer">
                        System
                      </span>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto py-6 px-6">
        <p className="text-center text-sm text-glow">
          &copy; 2025 Rhamsez Thevenin
        </p>
      </SidebarFooter>
    </UISidebar>
  );
}

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      className="fixed left-4 top-4 z-50 md:hidden red-glass border border-red-500/30 h-10 w-10 p-2 flex items-center justify-center shadow-red rounded-lg hover:scale-105 transition-all duration-300"
      aria-label="Toggle menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
} 
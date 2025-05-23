"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, ChevronDown, Menu, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@/components/ui/collapsible";
import { useTwitch } from "@/hooks/use-twitch";

interface Widget {
  href: string;
  name: string;
}

interface AppSidebarProps {
  widgets: Widget[];
}

function AppSidebar({ widgets }: AppSidebarProps) {
  const { setTheme } = useTheme();

  return (
    <Sidebar className="border-r border-red-500/20 z-50 mobile-sidebar">
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
    </Sidebar>
  );
}

function SidebarTrigger() {
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

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rhed-button h-10 w-10 p-0 flex items-center justify-center"
          size="icon"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dropdown navbar-dropdown-animation"
        align="center"
      >
        <DropdownMenuItem
          className="hover:font-bold transition-all ease-in-out hover:text-red-300 px-4 py-2.5"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:font-bold transition-all ease-in-out hover:text-red-300 px-4 py-2.5"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:font-bold transition-all ease-in-out hover:text-red-300 px-4 py-2.5"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Home() {
  const { videos, fetchVideos } = useTwitch();
  const [, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    fetchVideos();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchVideos]);

  const widgets = [
    { href: "/chat", name: "Chat" },
    { href: "/events", name: "Events (v2)" },
    { href: "/now-playing", name: "Now Playing" },
    { href: "/outrun", name: "Outrun" },
    { href: "/pomodoro", name: "24/7 Pomodoro" },
    { href: "/tts", name: "Text to Speech" },
  ];

  return (
    <SidebarProvider>
      {/* Main container - takes at least full viewport height */}
      <div className="bg-wood min-h-screen w-screen overflow-x-hidden flex flex-col">
        <AppSidebar widgets={widgets} />

        {/* Content wrapper - takes remaining height as a flex column */}
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <SidebarTrigger />

          {/* Header with better mobile styling */}
          <header className="sticky top-0 z-40 px-6 sm:px-8 py-4 red-glass border-b border-red-500/20 hidden md:flex md:items-center md:justify-between">
            <Link
              className="text-3xl transition-all duration-300 hover:scale-105"
              href="/"
            >
              &lt;
              <span className="font-black font-playwrite text-primary-800 text-glow">
                Rhed
              </span>{" "}
              /&gt;
            </Link>

            <nav className="flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-xl rhed-button h-10 px-4 flex items-center justify-center gap-2"
                    variant="ghost"
                  >
                    Widgets
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="navbar-dropdown-animation w-32 dropdown">
                  {widgets.map((widget) => (
                    <DropdownMenuItem
                      className="hover:text-red-300 transition-colors py-2.5 px-4"
                      key={widget.href}
                    >
                      <Link href={widget.href} className="w-full">
                        {widget.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="https://github.com/rhamzthev/rhed"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="text-xl rhed-button h-10 px-4 flex items-center justify-center gap-2"
                  variant="ghost"
                >
                  GitHub
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <ModeToggle />
            </nav>
          </header>

          {/* Main content - with better mobile padding */}
          <main className="px-5 sm:px-8 py-8 sm:py-10 flex-grow max-w-7xl mx-auto w-full">
            {/* Hero Section */}
            <section className="py-8 md:py-16 md:flex md:items-center md:justify-between gap-10 flex-grow">
              <div className="md:w-1/2 pb-8 md:pb-0">
                <h1 className="text-5xl sm:text-6xl md:text-7xl mb-5">
                  &lt;
                  <span className="font-black font-playwrite text-primary-800 text-glow">
                    Rhed
                  </span>{" "}
                  /&gt;
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-medium text-glow">
                  Rhamsez Thevenin&apos;s Content Creator Arc
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/donate">
                    <Button
                      className="rhed-button h-11 px-5 py-2.5 text-base sm:text-lg bg-red-600/40 hover:bg-red-600/50 border border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all duration-300 relative animate-pulse-subtle"
                      size="lg"
                    >
                      Donate
                    </Button>
                  </Link>
                  {widgets.slice(0, 3).map((widget) => (
                    <Link key={widget.href} href={widget.href}>
                      <Button
                        className="rhed-button h-11 px-5 py-2.5 text-base sm:text-lg shadow-red"
                        size="lg"
                      >
                        {widget.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Video section with better mobile spacing */}
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="red-glass rounded-2xl overflow-hidden video-glow">
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      src="https://player.twitch.tv/?channel=RhedDev&parent=rhed.rhamzthev.com&parent=localhost"
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Streams Section */}
            <section className="pt-10 sm:pt-16 relative z-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10">
                <span className="text-gradient-primary text-glow">
                  Recent Streams
                </span>
              </h2>

              <div
                className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
                style={{ minHeight: videos.length ? "auto" : "300px" }}
              >
                {videos.length ? (
                  videos.map((video: TwitchVideo) => (
                    <div
                      key={video.id}
                      className="red-glass p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all hover:scale-[1.03] border-[1px] border-red-500/10 flex flex-col shadow-red"
                    >
                      {/* Proper 16:9 container for videos */}
                      <div
                        className="relative w-full overflow-hidden rounded-xl"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <iframe
                          src={`https://player.twitch.tv/?video=${video.id}&parent=rhed.rhamzthev.com&parent=localhost&autoplay=false`}
                          className="absolute top-0 left-0 w-full h-full"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 text-glow">
                          {video.title}
                        </h3>
                        <p className="text-sm text-red-300 mt-2">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center py-16 text-xl text-red-300/70">
                    <div className="flex flex-col items-center gap-4">
                      <svg
                        className="animate-spin h-8 w-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading recent streams...
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Footer with better mobile styling */}
          <footer className="red-glass border-t border-red-500/20 px-5 sm:px-8 py-8 sm:py-10 relative z-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  &lt;
                  <span className="font-black font-playwrite text-primary-800 text-glow">
                    Rhed
                  </span>{" "}
                  /&gt;
                </h3>
                <p className="text-base sm:text-lg">#WAGMI</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 sm:mb-4">
                  Quick Links
                </h3>
                <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                  {widgets.map((widget) => (
                    <li key={widget.href}>
                      <Link
                        href={widget.href}
                        className="text-base hover:text-red-300 transition-colors hover:underline"
                      >
                        {widget.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2 md:col-span-1 mt-6 sm:mt-0">
                <h3 className="text-xl font-semibold mb-3 sm:mb-4">Connect</h3>
                <div className="flex space-x-5">
                  <Link
                    href="https://github.com/rhamzthev/rhed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rhed-button p-3 rounded-full h-12 w-12 flex items-center justify-center shadow-red"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </Link>
                  <Link
                    href="https://twitch.tv/RhedDev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rhed-button p-3 rounded-full h-12 w-12 flex items-center justify-center shadow-red"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-red-500/10 mt-6 pt-6 sm:mt-8 sm:pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">About Rhed</h3>
                  <p className="text-base mb-2">
                    Rhed is a content creation and streaming business operated by Rhamsez Thevenin.
                  </p>
                  <p className="text-base">
                    Based in the United States, established 2024.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Services Offered</h3>
                  <ul className="space-y-2">
                    <li>• Live coding and development streams</li>
                    <li>• Custom streaming widgets and tools</li>
                    <li>• Text to Speech (TTS) services</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center mt-6 pt-4 sm:mt-8 sm:pt-6 border-t border-red-500/10">
              <p className="text-base sm:text-lg">
                &copy; 2025 Rhamsez Thevenin
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

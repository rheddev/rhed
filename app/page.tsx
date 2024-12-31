"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, ChevronDown, Menu } from "lucide-react"
import { useTheme } from 'next-themes'
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
  useSidebar
} from "@/components/ui/sidebar"
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from '@/components/ui/collapsible'
import { useState, useEffect } from 'react'

interface Widget {
  href: string;
  name: string;
}

interface AppSidebarProps {
  widgets: Widget[];
}

interface TwitchVideo {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: string;
}

function AppSidebar({ widgets }: AppSidebarProps) {
  const { setTheme } = useTheme()

  return (
    <Sidebar>
      <SidebarHeader className='p-5'>
        <Link className="text-5xl text-center" href="/">
          &lt;<span className="font-playwrite font-black text-gradient-primary from-white">Rhed</span> /&gt;
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className='space-y-5'>
            <Collapsible className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className='text-2xl flex justify-between'><span>Widgets</span><ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" /></SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='sidebar-dropdown-animation'>
                  <SidebarMenuSub className='text-2xl space-y-5 py-3'>
                    {widgets.map((widget) => {
                      return <SidebarMenuSubItem key={widget.href}><Link href={widget.href}>{widget.name}</Link></SidebarMenuSubItem>
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <SidebarMenuItem>
              <SidebarMenuButton className='text-2xl' asChild>
                <Link href="https://github.com/rhamzthev/rhed" target="_blank" rel="noopener noreferrer">GitHub</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className='hover:scale-105 flex items-center justify-center' variant="outline" size="default">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='sidebar-dropdown-animation'>
                  <SidebarMenuSub className='text-2xl space-y-5 py-3'>
                    <SidebarMenuSubItem onClick={() => setTheme("light")}>
                      Light
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem onClick={() => setTheme("dark")}>
                      Dark
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem onClick={() => setTheme("system")}>
                      System
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className='text-center text-base'>&copy; 2025 Rhamsez Thevenin</p>
      </SidebarFooter>
    </Sidebar>
  )
}

function SidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    < Button onClick = { toggleSidebar } className = 'absolute left-3 top-3 md:hidden' >
      <Menu />
    </Button >
  )
}

function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='transition ease-in-out hover:scale-105' variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='navbar-dropdown-animation bg-sidebar text-2xl' align="center">
        <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Home() {

  const [videos, setVideos] = useState<TwitchVideo[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(
          `https://api.twitch.tv/helix/videos?user_id=${process.env.NEXT_PUBLIC_TWITCH_USER_ID}&first=3`,
          {
            headers: {
              'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TWITCH_OAUTH_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setVideos(data.data || []);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    }

    fetchVideos();
  }, []);

  const widgets = [
    { href: "/chat", name: "Chat" },
    { href: "/events", name: "Events" },
    { href: "/custom", name: "Custom" },
    { href: "/outrun", name: "Outrun" },
  ]

  return (
    <SidebarProvider>
      <AppSidebar widgets={widgets} />
      <main className='w-screen min-h-screen'>
        <SidebarTrigger />
        <div className="w-full h-full md:flex md:flex-col">
          {/* Header */}
          <header className="hidden px-8 py-5 bg-gradient-to-b from-[rgba(0,0,0,0.34)] to-transparent md:inline">
            <div className="md:flex md:flex-row md:items-center md:justify-between">
              <Link className="text-3xl" href="/">
                &lt;<span className="font-black font-playwrite text-gradient-primary from-white">Rhed</span> /&gt;
              </Link>

              <nav className="space-x-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="text-2xl transition ease-in-out hover:scale-105"
                      variant="ghost"
                    >
                      <span className="text-2xl">Widgets</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-32 bg-sidebar navbar-dropdown-animation">
                    {widgets.map(widget => (
                      <DropdownMenuItem
                        className="transition-all ease-in-out hover:font-bold"
                        key={widget.href}
                      >
                        <Link href={widget.href}>{widget.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="https://github.com/rhamzthev/rhed" target="_blank" rel="noopener noreferrer">
                  <Button
                    className="text-2xl transition ease-in-out hover:scale-105"
                    variant="ghost"
                  >
                    GitHub
                  </Button>
                </Link>
                <ModeToggle />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-5 space-y-5 md:flex-grow md:flex md:flex-col">
            {/* Hero Section */}
            <section className="md:flex-grow md:flex md:items-center md:justify-center">
              <div className="flex flex-col w-full h-full md:space-x-8 md:flex-row md:items-center md:justify-around">
                <div className="text-center pb-5 md:text-left">
                  <h1 className="text-5xl">
                    &lt;<span className="font-black font-playwrite text-gradient-primary">Rhed</span> /&gt;
                  </h1>
                  <p className="text-2xl">Rhamsez Thevenin&apos;s Content Creator Arc</p>
                </div>

                <div className="w-full aspect-video md:w-1/2">
                  <iframe
                    src="https://player.twitch.tv/?channel=RhedDev&parent=rhed.rhamzthev.com&parent=localhost"
                    className="w-full h-full rounded-2xl"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>

            {/* Recent Streams Section */}
            <section className="md:flex-grow">
              <h2 className="text-3xl font-bold text-center text-primary_from pb-5">Recent Streams</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {videos.map((video) => (
                  <div key={video.id} className="space-y-1">
                    <iframe
                      src={`https://player.twitch.tv/?video=${video.id}&parent=rhed.rhamzthev.com&parent=localhost&autoplay=false`}
                      className="w-full aspect-video rounded-lg"
                      allowFullScreen
                    />
                    <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="hidden px-5 py-3 bg-gradient-to-t from-[rgba(0,0,0,0.76)] to-transparent md:h-auto md:flex md:items-center md:justify-center">
            <div className="text-center">
              <p className="text-base">&copy; 2025 Rhamsez Thevenin</p>
            </div>
          </footer>
        </div>
      </main>
    </SidebarProvider>
  )
}

